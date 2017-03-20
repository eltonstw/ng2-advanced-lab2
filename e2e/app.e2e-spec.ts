import { NgContentLabPage } from './app.po';

describe('ng-content-lab App', () => {
  let page: NgContentLabPage;

  beforeEach(() => {
    page = new NgContentLabPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
