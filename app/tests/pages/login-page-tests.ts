import { LoginViewModel } from "~/pages/login/login-view-model";
import { LoginService } from "~/services/login-service";
import { Button } from "tns-core-modules/ui/button";
import { Page } from "tns-core-modules/ui/page";

describe("Login Page", () => {

  let loginService: LoginService;
  let loginViewModel: LoginViewModel;

  beforeEach(() => {
    loginService = jasmine.createSpyObj(LoginService);
    loginViewModel = new LoginViewModel();
    loginViewModel.loginService = loginService;
  });

  it("Should call login service after Login button tap", async () => {
    var spy = spyOn(loginService, 'login');
    await loginViewModel.onLoginButtonTap(null);
    expect(spy).toHaveBeenCalledWith(null);
  });

});  