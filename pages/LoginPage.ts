import { Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class LoginPage extends BasePage {
  // TODO: data-testid not in site HTML — CSS fallback
  readonly emailInput = '[data-testid="login-email"], #input-email';
  // TODO: data-testid not in site HTML — CSS fallback
  readonly passwordInput = '[data-testid="login-password"], #input-password';
  // TODO: data-testid not in site HTML — CSS fallback
  readonly loginButton =
    '[data-testid="login-button"], input[type="submit"][value="Login"]';
  readonly errorAlert = '.alert-danger';

  constructor(page: Page) {
    super(page);
  }

  async goto(): Promise<void> {
    await this.navigate('/index.php?route=account/login');
    await this.waitForVisible(this.emailInput);
  }

  async login(email: string, password: string): Promise<void> {
    await this.fill(this.emailInput, email, 'Email');
    await this.fill(this.passwordInput, password, 'Password');
    await this.click(this.loginButton, 'Login button');
  }
}
