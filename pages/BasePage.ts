import { Page, Locator, type Response } from '@playwright/test';
import { getBaseUrl, resolveUrl } from '../config/env';
import { aiHealer } from '../services/ai-healer';
import { logger } from '../utils/logger';
import { logNavigation, logNavigationError } from '../utils/navigation-logger';

export class BasePage {
  public page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  // ==================== PRIVATE HELPERS ====================

  private logActionStart(action: string, selector: string, description?: string) {
    const desc = description || selector;
    logger.info(`▶️  Starting: ${action} on "${desc}" [${selector}]`);
  }

  private logActionSuccess(action: string, selector: string, description?: string) {
    const desc = description || selector;
    logger.info(`✅  Completed: ${action} on "${desc}" [${selector}]`);
  }

  private logActionFailure(action: string, selector: string, error: any, description?: string) {
    const desc = description || selector;
    logger.error(`❌  Failed: ${action} on "${desc}" [${selector}] — ${error.message}`);
  }

  private async performHealableAction(
    action: string,
    selector: string,
    description: string | undefined,
    actionFn: (loc: Locator) => Promise<void>,
    healingFn?: (loc: Locator) => Promise<void>,
    verify?: () => Promise<void>,
  ): Promise<void> {
    const desc = description || selector;
    this.logActionStart(action, selector, description);

    const executeAndVerify = async (loc: Locator) => {
      await actionFn(loc);
      if (verify) await verify();
    };

    // 1) Race the original selector against a 30‑second timeout
    try {
      await Promise.race([
        executeAndVerify(this.page.locator(selector)),
        new Promise<void>((_, reject) =>
          setTimeout(() => reject(new Error('Short timeout to trigger healing')), 30_000),
        ),
      ]);
      this.logActionSuccess(action, selector, description);
      return;
    } catch (originalError: any) {
      // DIAGNOSTIC LOGS
      console.error('🔎 Error caught:', originalError.message);
      console.error('🔎 SELF_HEALING_ENABLED =', process.env.SELF_HEALING_ENABLED);

      // 2) Attempt healing
      if (process.env.SELF_HEALING_ENABLED === 'true') {
        logger.warn(`🩹 Healing needed for: ${desc} [${selector}]`);

        try {
          const result = await aiHealer.healSelector(this.page, selector, desc);
          if (result.healedSelector) {
            logger.info(`✨ Healed to: ${result.healedSelector}`);
            const healedLocator = this.page.locator(result.healedSelector);
            if (healingFn) {
              await healingFn(healedLocator);
            } else {
              await actionFn(healedLocator);
            }
            if (verify) await verify();
            this.logActionSuccess(action, result.healedSelector, description);
            return;
          }
        } catch (healingError: any) {
          logger.error(`🩺 Healing attempt/verification failed: ${healingError.message}`);
        }
      }
      // 3) Everything failed
      this.logActionFailure(action, selector, originalError, description);
      throw originalError;
    }
  }

  // ==================== NAVIGATION ====================

  /**
   * Navigate using `BASE_URL` from `.env` for relative paths.
   */
  async navigate(pathOrUrl: string): Promise<Response | null> {
    const base = getBaseUrl();
    const target = resolveUrl(pathOrUrl);
    logNavigation(`Navigating to: ${target} (BASE_URL=${base})`);
    try {
      const response = await this.page.goto(target, {
        waitUntil: 'domcontentloaded',
        timeout: 60_000,
      });
      logNavigation(`Landed on: ${this.page.url()}`);
      return response;
    } catch (error) {
      logNavigationError(`Navigation failed: ${target}`, error);
      throw error;
    }
  }

  async reload(): Promise<void> {
    logger.info('🔄 Reloading page');
    await this.page.reload();
  }

  async goBack(): Promise<void> {
    logger.info('⬅️  Going back');
    await this.page.goBack();
  }

  async goForward(): Promise<void> {
    logger.info('➡️  Going forward');
    await this.page.goForward();
  }

  async getCurrentUrl(): Promise<string> {
    const url = this.page.url();
    logger.info(`📍 Current URL: ${url}`);
    return url;
  }

  async getTitle(): Promise<string> {
    const title = await this.page.title();
    logger.info(`📄 Page title: ${title}`);
    return title;
  }

  // ==================== CLICKING ====================

  async click(selector: string, description?: string, verify?: () => Promise<void>): Promise<void> {
    await this.performHealableAction(
      'click',
      selector,
      description,
      async (loc) => {
        await loc.click();
      },
      undefined,
      verify,
    );
  }

  async doubleClick(
    selector: string,
    description?: string,
    verify?: () => Promise<void>,
  ): Promise<void> {
    await this.performHealableAction(
      'doubleClick',
      selector,
      description,
      async (loc) => {
        await loc.dblclick();
      },
      undefined,
      verify,
    );
  }

  async rightClick(
    selector: string,
    description?: string,
    verify?: () => Promise<void>,
  ): Promise<void> {
    await this.performHealableAction(
      'rightClick',
      selector,
      description,
      async (loc) => {
        await loc.click({ button: 'right' });
      },
      undefined,
      verify,
    );
  }

  async hover(selector: string, description?: string, verify?: () => Promise<void>): Promise<void> {
    await this.performHealableAction(
      'hover',
      selector,
      description,
      async (loc) => {
        await loc.hover();
      },
      undefined,
      verify,
    );
  }

  // ==================== TYPING & INPUT ====================

  async fill(
    selector: string,
    text: string,
    description?: string,
    verify?: () => Promise<void>,
  ): Promise<void> {
    await this.performHealableAction(
      'fill',
      selector,
      description,
      async (loc) => {
        await loc.fill(text);
      },
      undefined,
      verify,
    );
  }

  async type(
    selector: string,
    text: string,
    delay = 100,
    description?: string,
    verify?: () => Promise<void>,
  ): Promise<void> {
    await this.performHealableAction(
      'type',
      selector,
      description,
      async (loc) => {
        await loc.type(text, { delay });
      },
      undefined,
      verify,
    );
  }

  async clear(selector: string, description?: string, verify?: () => Promise<void>): Promise<void> {
    await this.performHealableAction(
      'clear',
      selector,
      description,
      async (loc) => {
        await loc.fill('');
      },
      undefined,
      verify,
    );
  }

  async pressKey(
    selector: string,
    key: string,
    description?: string,
    verify?: () => Promise<void>,
  ): Promise<void> {
    await this.performHealableAction(
      'pressKey',
      selector,
      description,
      async (loc) => {
        await loc.press(key);
      },
      undefined,
      verify,
    );
  }

  // ==================== SELECTORS & DROPDOWNS ====================

  async selectOption(
    selector: string,
    value: string,
    description?: string,
    verify?: () => Promise<void>,
  ): Promise<void> {
    await this.performHealableAction(
      'selectOption',
      selector,
      description,
      async (loc) => {
        await loc.selectOption({ label: value });
      },
      async (healedLoc) => {
        await healedLoc.selectOption({ label: value });
      },
      verify,
    );
  }

  async selectOptionByValue(
    selector: string,
    value: string,
    description?: string,
    verify?: () => Promise<void>,
  ): Promise<void> {
    await this.performHealableAction(
      'selectOptionByValue',
      selector,
      description,
      async (loc) => {
        await loc.selectOption({ value });
      },
      async (healedLoc) => {
        await healedLoc.selectOption({ value });
      },
      verify,
    );
  }

  async selectOptionByIndex(
    selector: string,
    index: number,
    description?: string,
    verify?: () => Promise<void>,
  ): Promise<void> {
    await this.performHealableAction(
      'selectOptionByIndex',
      selector,
      description,
      async (loc) => {
        await loc.selectOption({ index });
      },
      async (healedLoc) => {
        await healedLoc.selectOption({ index });
      },
      verify,
    );
  }

  // ==================== CHECKBOXES & RADIO BUTTONS ====================

  async check(selector: string, description?: string, verify?: () => Promise<void>): Promise<void> {
    await this.performHealableAction(
      'check',
      selector,
      description,
      async (loc) => {
        await loc.check();
      },
      undefined,
      verify,
    );
  }

  async uncheck(
    selector: string,
    description?: string,
    verify?: () => Promise<void>,
  ): Promise<void> {
    await this.performHealableAction(
      'uncheck',
      selector,
      description,
      async (loc) => {
        await loc.uncheck();
      },
      undefined,
      verify,
    );
  }

  async isChecked(selector: string): Promise<boolean> {
    const result = await this.page.isChecked(selector);
    logger.info(`🔘 isChecked [${selector}]: ${result}`);
    return result;
  }

  // ==================== GETTING INFORMATION ====================

  async getText(selector: string): Promise<string> {
    const text = (await this.page.textContent(selector)) || '';
    logger.info(
      `📝 getText [${selector}]: "${text.substring(0, 50)}${text.length > 50 ? '...' : ''}"`,
    );
    return text;
  }

  async getInnerHtml(selector: string): Promise<string> {
    const html = await this.page.innerHTML(selector);
    logger.info(`📝 getInnerHtml [${selector}]: length ${html.length}`);
    return html;
  }

  async getAttribute(selector: string, attribute: string): Promise<string | null> {
    const value = await this.page.getAttribute(selector, attribute);
    logger.info(`📝 getAttribute [${selector}][${attribute}]: ${value}`);
    return value;
  }

  async getInputValue(selector: string): Promise<string> {
    const value = await this.page.inputValue(selector);
    logger.info(`📝 getInputValue [${selector}]: "${value}"`);
    return value;
  }

  async getCount(selector: string): Promise<number> {
    const count = await this.page.locator(selector).count();
    logger.info(`📝 getCount [${selector}]: ${count}`);
    return count;
  }

  // ==================== WAITING & VISIBILITY ====================

  async waitForSelector(
    selector: string,
    timeout = 30000,
    description?: string,
    verify?: () => Promise<void>,
  ): Promise<void> {
    await this.performHealableAction(
      'waitForSelector',
      selector,
      description,
      async (loc) => {
        await loc.waitFor({ state: 'attached', timeout });
      },
      undefined,
      verify,
    );
  }

  async waitForVisible(
    selector: string,
    timeout = 30000,
    description?: string,
    verify?: () => Promise<void>,
  ): Promise<void> {
    await this.performHealableAction(
      'waitForVisible',
      selector,
      description,
      async (loc) => {
        await loc.waitFor({ state: 'visible', timeout });
      },
      undefined,
      verify,
    );
  }

  async waitForHidden(
    selector: string,
    timeout = 30000,
    description?: string,
    verify?: () => Promise<void>,
  ): Promise<void> {
    await this.performHealableAction(
      'waitForHidden',
      selector,
      description,
      async (loc) => {
        await loc.waitFor({ state: 'hidden', timeout });
      },
      undefined,
      verify,
    );
  }

  async waitForText(text: string, timeout = 30000): Promise<void> {
    logger.info(`⏳ Waiting for text: "${text}"`);
    await this.page.waitForSelector(`text=${text}`, { timeout });
    logger.info(`✅ Text found: "${text}"`);
  }

  async waitForUrl(urlPart: string, timeout = 30000): Promise<void> {
    logger.info(`⏳ Waiting for URL containing: "${urlPart}"`);
    await this.page.waitForURL(`**/*${urlPart}**`, { timeout });
    logger.info(`✅ URL matched: "${urlPart}"`);
  }

  async waitForNetworkIdle(timeout = 5000): Promise<void> {
    logger.info('⏳ Waiting for network idle');
    await this.page.waitForLoadState('networkidle', { timeout });
    logger.info('✅ Network idle');
  }

  async wait(ms: number): Promise<void> {
    logger.info(`⏳ Waiting ${ms}ms`);
    await this.page.waitForTimeout(ms);
  }

  async isVisible(selector: string): Promise<boolean> {
    const visible = await this.page.isVisible(selector);
    logger.info(`👁️  isVisible [${selector}]: ${visible}`);
    return visible;
  }

  async isEnabled(selector: string): Promise<boolean> {
    const enabled = await this.page.isEnabled(selector);
    logger.info(`🔌 isEnabled [${selector}]: ${enabled}`);
    return enabled;
  }

  async exists(selector: string): Promise<boolean> {
    const exists = (await this.page.locator(selector).count()) > 0;
    logger.info(`❓ exists [${selector}]: ${exists}`);
    return exists;
  }

  // ==================== SCROLLING ====================

  async scrollToElement(
    selector: string,
    description?: string,
    verify?: () => Promise<void>,
  ): Promise<void> {
    await this.performHealableAction(
      'scrollToElement',
      selector,
      description,
      async (loc) => {
        await loc.scrollIntoViewIfNeeded();
      },
      undefined,
      verify,
    );
  }

  async scrollToTop(): Promise<void> {
    logger.info('⬆️  Scrolling to top');
    await this.page.evaluate(() => window.scrollTo(0, 0));
  }

  async scrollToBottom(): Promise<void> {
    logger.info('⬇️  Scrolling to bottom');
    await this.page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  }

  // ==================== DRAG & DROP ====================

  async dragAndDrop(
    sourceSelector: string,
    targetSelector: string,
    description?: string,
  ): Promise<void> {
    const desc = description || `drag ${sourceSelector} to ${targetSelector}`;
    this.logActionStart('dragAndDrop', sourceSelector, description);
    try {
      await this.page.dragAndDrop(sourceSelector, targetSelector);
      this.logActionSuccess('dragAndDrop', sourceSelector, description);
    } catch (error: any) {
      this.logActionFailure('dragAndDrop', sourceSelector, error, description);
      throw error;
    }
  }

  // ==================== FRAMES & WINDOWS ====================

  async switchToFrame(selector: string): Promise<void> {
    logger.info(`🖼️  Switching to frame: ${selector}`);
    this.page.frameLocator(selector);
  }

  async switchToMainFrame(): Promise<void> {
    logger.info('🖼️  Switching to main frame');
  }

  // ==================== ALERTS & POPUPS ====================

  async acceptAlert(): Promise<void> {
    logger.info('🚨 Accepting alert');
    this.page.on('dialog', async (dialog) => {
      await dialog.accept();
    });
  }

  async dismissAlert(): Promise<void> {
    logger.info('🚨 Dismissing alert');
    this.page.on('dialog', async (dialog) => {
      await dialog.dismiss();
    });
  }

  async getAlertText(): Promise<string> {
    let alertText = '';
    this.page.on('dialog', async (dialog) => {
      alertText = dialog.message();
      await dialog.accept();
    });
    logger.info(`🚨 Alert text: "${alertText}"`);
    return alertText;
  }

  // ==================== SCREENSHOTS ====================

  async takeScreenshot(name: string): Promise<void> {
    const path = `screenshots/${name}.png`;
    await this.page.screenshot({ path, fullPage: true });
    logger.info(`📸 Screenshot saved: ${path}`);
  }

  async takeElementScreenshot(selector: string, name: string): Promise<void> {
    const path = `screenshots/${name}.png`;
    await this.page.locator(selector).screenshot({ path });
    logger.info(`📸 Element screenshot saved: ${path}`);
  }

  // ==================== COOKIES & STORAGE ====================

  async getCookies(): Promise<object[]> {
    const cookies = await this.page.context().cookies();
    logger.info(`🍪 Cookies count: ${cookies.length}`);
    return cookies;
  }

  async setCookie(name: string, value: string): Promise<void> {
    await this.page.context().addCookies([{ name, value, url: getBaseUrl() }]);
    logger.info(`🍪 Cookie set: ${name}=${value}`);
  }

  async clearCookies(): Promise<void> {
    await this.page.context().clearCookies();
    logger.info('🍪 All cookies cleared');
  }

  async setLocalStorage(key: string, value: string): Promise<void> {
    await this.page.evaluate(([k, v]) => localStorage.setItem(k, v), [key, value]);
    logger.info(`💾 localStorage set: ${key}=${value}`);
  }

  async getLocalStorage(key: string): Promise<string | null> {
    const val = await this.page.evaluate((k) => localStorage.getItem(k), key);
    logger.info(`💾 localStorage get: ${key}=${val}`);
    return val;
  }

  // ==================== TABS & WINDOWS ====================

  async openNewTab(pathOrUrl: string): Promise<Page> {
    const target = resolveUrl(pathOrUrl);
    logger.info(`🌐 Opening new tab: ${target}`);
    const newPage = await this.page.context().newPage();
    await newPage.goto(target);
    return newPage;
  }

  async getAllPages(): Promise<Page[]> {
    const pages = this.page.context().pages();
    logger.info(`🗂️  Open tabs: ${pages.length}`);
    return pages;
  }

  async closeTab(): Promise<void> {
    logger.info('❌ Closing current tab');
    await this.page.close();
  }

  // ============ TestId fallback to selector ==================
  
  protected locate(testId: string, fallback: string, description?: string): Locator {
    const desc = description || testId || fallback;
    return this.page.getByTestId(testId).or(this.page.locator(fallback)).describe(desc);
  }
}
