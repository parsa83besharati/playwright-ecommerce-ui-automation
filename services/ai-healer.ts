import 'dotenv/config';
import OpenAI from 'openai';
import { Page } from '@playwright/test';
import { logger } from '../utils/logger';

// ==================== TYPES ====================

interface HealingResult {
  healedSelector: string | null;
  usedSelector: string | null;
  confidence: number;
  provider?: string;
  cached?: boolean;
  error?: string;
}

interface LLMProvider {
  name: string;
  client: OpenAI;
  model: string;
  priority: number;
}

interface HealingCache {
  selector: string;
  healedSelector: string;
  provider: string;
  timestamp: number;
  hitCount: number;
}

// ==================== AI HEALER ====================

class AIHealer {
  private providers: LLMProvider[] = [];
  private enabled: boolean;
  private cache: Map<string, HealingCache> = new Map();
  private readonly CACHE_TTL = 30 * 60 * 1000; // 30 minutes
  private readonly MAX_CACHE_SIZE = 100;

  constructor() {
    this.enabled = process.env.SELF_HEALING_ENABLED === 'true';
    this.initializeProviders();
  }

  private initializeProviders(): void {
    // DeepSeek (primary - cheapest)
    if (process.env.DEEPSEEK_API_KEY) {
      this.providers.push({
        name: 'deepseek',
        client: new OpenAI({
          apiKey: process.env.DEEPSEEK_API_KEY,
          baseURL: process.env.DEEPSEEK_BASE_URL || 'https://api.deepseek.com/v1',
        }),
        model: process.env.DEEPSEEK_MODEL || 'deepseek-chat',
        priority: 1,
      });
    }

    // OpenAI (fallback)
    if (process.env.OPENAI_API_KEY) {
      this.providers.push({
        name: 'openai',
        client: new OpenAI({
          apiKey: process.env.OPENAI_API_KEY,
          baseURL: process.env.OPENAI_BASE_URL || 'https://api.openai.com/v1',
        }),
        model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
        priority: 2,
      });
    }

    // Anthropic via OpenAI-compatible endpoint (fallback)
    if (process.env.ANTHROPIC_API_KEY) {
      this.providers.push({
        name: 'anthropic',
        client: new OpenAI({
          apiKey: process.env.ANTHROPIC_API_KEY,
          baseURL: process.env.ANTHROPIC_BASE_URL || 'https://api.anthropic.com/v1',
        }),
        model: process.env.ANTHROPIC_MODEL || 'claude-3-haiku-20240307',
        priority: 3,
      });
    }

    // Local / custom provider (last resort - free)
    if (process.env.CUSTOM_LLM_API_KEY && process.env.CUSTOM_LLM_BASE_URL) {
      this.providers.push({
        name: 'custom',
        client: new OpenAI({
          apiKey: process.env.CUSTOM_LLM_API_KEY,
          baseURL: process.env.CUSTOM_LLM_BASE_URL,
        }),
        model: process.env.CUSTOM_LLM_MODEL || 'local-model',
        priority: 4,
      });
    }

    // Sort by priority
    this.providers.sort((a, b) => a.priority - b.priority);

    if (this.providers.length > 0) {
      logger.info(
        `🤖 AI Healer initialized with ${this.providers.length} provider(s): ${this.providers.map((p) => p.name).join(', ')}`,
      );
    }
  }

  /**
   * Attempt to heal a broken locator with provider fallback chain.
   */
  async healSelector(
    page: Page,
    brokenSelector: string,
    elementDescription: string,
  ): Promise<HealingResult> {
    if (!this.enabled) {
      return { healedSelector: null, usedSelector: brokenSelector, confidence: 0 };
    }

    // Check cache first
    const cached = this.getCachedResult(brokenSelector);
    if (cached) {
      logger.info(`💾 Using cached selector: ${cached.healedSelector}`);
      return {
        healedSelector: cached.healedSelector,
        usedSelector: cached.healedSelector,
        confidence: 1.0,
        provider: cached.provider,
        cached: true,
      };
    }

    if (this.providers.length === 0) {
      logger.warn('⚠️ No LLM providers configured for self-healing.');
      return { healedSelector: null, usedSelector: brokenSelector, confidence: 0 };
    }

    logger.info(`🩺 Attempting to heal: ${brokenSelector}`);

    try {
      const htmlSnippet = await this.capturePageContext(page);

      // Try each provider in priority order
      for (const provider of this.providers) {
        try {
          logger.info(`🤖 Trying ${provider.name}...`);
          const suggestions = await this.askLLM(
            provider,
            brokenSelector,
            elementDescription,
            htmlSnippet,
          );

          for (const suggestion of suggestions) {
            const isValid = await this.testSelector(page, suggestion);
            if (isValid) {
              logger.info(`✅ Healed via ${provider.name}: ${suggestion}`);
              this.cacheResult(brokenSelector, suggestion, provider.name);
              return {
                healedSelector: suggestion,
                usedSelector: suggestion,
                confidence: 1.0,
                provider: provider.name,
              };
            }
          }
        } catch (error: any) {
          logger.warn(`⚠️ ${provider.name} failed: ${error.message}`);
          continue; // Try next provider
        }
      }

      logger.warn('⚠️ No valid healed selector found from any provider.');
      return { healedSelector: null, usedSelector: brokenSelector, confidence: 0 };
    } catch (error) {
      logger.error('Self-healing failed:', error);
      return {
        healedSelector: null,
        usedSelector: brokenSelector,
        confidence: 0,
        error: String(error),
      };
    }
  }

  private async capturePageContext(page: Page): Promise<string> {
    const [html, url, title] = await Promise.all([
      page.evaluate(() => {
        // Get meaningful elements only, skip scripts/styles
        const clone = document.body.cloneNode(true) as HTMLElement;
        clone.querySelectorAll('script, style, noscript').forEach((el) => el.remove());
        return clone.innerHTML;
      }),
      page.url(),
      page.title(),
    ]);

    return `URL: ${url}\nTitle: ${title}\n\n${html}`;
  }

  private async askLLM(
    provider: LLMProvider,
    brokenSelector: string,
    description: string,
    pageContext: string,
  ): Promise<string[]> {
    const systemPrompt = `You are an expert Playwright test automation engineer specializing in resilient selector strategies.

RULES:
1. Output ONLY a valid JSON array of strings - no explanations, no markdown
2. Prioritize selectors in this order:
   - data-testid, data-cy, data-qa attributes
   - aria-label, aria-labelledby, role attributes
   - name, id, placeholder attributes
   - Text content selectors (getByText, getByRole)
   - Stable CSS selectors (class-based, not positional)
3. Never suggest selectors with nth-child, nth-of-type, or index-based positioning
4. Consider the element's purpose and context when suggesting alternatives`;

    const userPrompt = `A Playwright test failed because the selector could not find the target element.

BROKEN SELECTOR: ${brokenSelector}
ELEMENT DESCRIPTION: ${description}

PAGE CONTEXT (HTML excerpt):
${pageContext.slice(0, 12000)}

Suggest up to 5 alternative Playwright locators. Return ONLY a JSON array.
Example: ["[data-testid='login-btn']", "button:has-text('Login')", "#login-button"]`;

    const completion = await provider.client.chat.completions.create({
      model: provider.model,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      temperature: 0.1,
      max_tokens: 500,
    });

    const content = completion.choices[0]?.message?.content?.trim() || '[]';
    return this.parseJSONResponse(content);
  }

  private parseJSONResponse(content: string): string[] {
    try {
      // Try direct parse
      const parsed = JSON.parse(content);
      if (Array.isArray(parsed)) return parsed.filter((s) => typeof s === 'string');
    } catch {
      // Try extracting from markdown code block
      const match = content.match(/```(?:json)?\s*([\s\S]*?)```/);
      if (match) {
        try {
          const parsed = JSON.parse(match[1].trim());
          if (Array.isArray(parsed)) return parsed.filter((s) => typeof s === 'string');
        } catch {
          // Fall through
        }
      }

      // Try finding array in text
      const arrayMatch = content.match(/\[[\s\S]*?\]/);
      if (arrayMatch) {
        try {
          const parsed = JSON.parse(arrayMatch[0]);
          if (Array.isArray(parsed)) return parsed.filter((s) => typeof s === 'string');
        } catch {
          // Fall through
        }
      }
    }

    logger.error('Failed to parse LLM response:', content.slice(0, 200));
    return [];
  }

  private async testSelector(page: Page, selector: string): Promise<boolean> {
    try {
      const locator = page.locator(selector);
      await locator.waitFor({ state: 'visible', timeout: 5000 });
      const count = await locator.count();
      return count === 1;
    } catch {
      return false;
    }
  }

  // ==================== CACHE ====================

  private getCachedResult(selector: string): HealingCache | null {
    const cached = this.cache.get(selector);
    if (!cached) return null;

    // Check TTL
    if (Date.now() - cached.timestamp > this.CACHE_TTL) {
      this.cache.delete(selector);
      return null;
    }

    cached.hitCount++;
    return cached;
  }

  private cacheResult(selector: string, healedSelector: string, provider: string): void {
    // Evict oldest if at capacity
    if (this.cache.size >= this.MAX_CACHE_SIZE) {
      const oldest = Array.from(this.cache.entries()).sort(
        (a, b) => a[1].timestamp - b[1].timestamp,
      )[0];
      if (oldest) this.cache.delete(oldest[0]);
    }

    this.cache.set(selector, {
      selector,
      healedSelector,
      provider,
      timestamp: Date.now(),
      hitCount: 1,
    });
  }

  public getCacheStats(): { size: number; entries: HealingCache[] } {
    return {
      size: this.cache.size,
      entries: Array.from(this.cache.values()),
    };
  }

  public clearCache(): void {
    this.cache.clear();
    logger.info('🗑️ Healing cache cleared');
  }
}

export const aiHealer = new AIHealer();
