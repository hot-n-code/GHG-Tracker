import { Selector } from 'testcafe';

class SignoutPage {
  constructor() {
    this.pageId = '#login-dropdown-sign-in';
    this.pageSelector = Selector(this.pageId);
  }

  /** Checks that this page is currently displayed. */
  async isDisplayed(testController) {
    await testController.expect(this.pageSelector.exists).ok();
  }
}

export const signoutPage = new SignoutPage();
