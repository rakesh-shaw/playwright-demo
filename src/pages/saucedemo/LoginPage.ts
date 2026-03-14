import { expect, Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class LoginPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  username = () => this.byTestId('username');
  password = () => this.byTestId('password');
  loginBtn = () => this.byTestId('login-button');
  error = () => this.byTestId('error');

  async goto() {
    await this.open('/');
  }

  async login(username: string, password: string) {
    await this.username().fill(username);
    await this.password().fill(password);
    await this.loginBtn().click();
  }

  async expectError(contains: RegExp) {
    await expect(this.error()).toBeVisible();
    await expect(this.error()).toContainText(contains);
  }
}
