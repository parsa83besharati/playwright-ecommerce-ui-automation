import { Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class RegisterPage extends BasePage {
  // TODO: data-testid not in site HTML — CSS fallback
  readonly firstNameInput = '[data-testid="register-firstname"], #input-firstname';
  // TODO: data-testid not in site HTML — CSS fallback
  readonly lastNameInput = '[data-testid="register-lastname"], #input-lastname';
  // TODO: data-testid not in site HTML — CSS fallback
  readonly emailInput = '[data-testid="register-email"], #input-email';
  // TODO: data-testid not in site HTML — CSS fallback
  readonly phoneInput = '[data-testid="register-telephone"], #input-telephone';
  // TODO: data-testid not in site HTML — CSS fallback
  readonly passwordInput = '[data-testid="register-password"], #input-password';
  // TODO: data-testid not in site HTML — CSS fallback
  readonly confirmPasswordInput = '[data-testid="register-confirm"], #input-confirm';
  // TODO: data-testid not in site HTML — CSS fallback
  readonly privacyCheckbox = '[data-testid="register-privacy"], #input-agree';
  readonly newsletterYes = '#input-newsletter-yes';
  readonly newsletterNo = '#input-newsletter-no';
  // TODO: data-testid not in site HTML — CSS fallback
  readonly continueButton =
    '[data-testid="register-continue"], input[type="submit"][value="Continue"]';
  readonly errorAlert = '.alert-danger';
  readonly fieldError = '.text-danger';
  readonly accountHeading = 'h2:has-text("My Account")';

  constructor(page: Page) {
    super(page);
  }

  async goto(): Promise<void> {
    await this.navigate('/index.php?route=account/register');
    await this.waitForVisible(this.firstNameInput);
  }

  async fillRegistration(data: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    password: string;
    confirmPassword?: string;
    agreePrivacy?: boolean;
  }): Promise<void> {
    await this.fill(this.firstNameInput, data.firstName);
    await this.fill(this.lastNameInput, data.lastName);
    await this.fill(this.emailInput, data.email);
    await this.fill(this.phoneInput, data.phone);
    await this.fill(this.passwordInput, data.password);
    const confirm = data.confirmPassword ?? data.password;
    await this.fill(this.confirmPasswordInput, confirm);
    if (data.agreePrivacy === true) {
      await this.check(this.privacyCheckbox);
    }
    if (data.agreePrivacy === false) {
      await this.uncheck(this.privacyCheckbox);
    }
  }

  async submit(): Promise<void> {
    await this.click(this.continueButton, 'Continue button');
  }
}
