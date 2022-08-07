import { Configuration as UserConfig, UserApi } from "../../openapi/user";

const API_HOST = process.env.REACT_APP_API_HOST || "http://localhost";
const BASE_PATH = {
  userAPI: API_HOST + "/api/v1/users",
};

class OpenAPi {
  accessToken = "";
  UserAPI: UserApi;

  constructor() {
    this.UserAPI = new UserApi(
      new UserConfig({ accessToken: "", basePath: BASE_PATH.userAPI })
    );
  }

  setAuthConfig(accessToken: string) {
    this.accessToken = accessToken;

    this.setUserAPI();
  }

  setUserAPI() {
    const configuration = new UserConfig({
      accessToken: this.accessToken,
      basePath: BASE_PATH.userAPI,
    });

    this.UserAPI = new UserApi(configuration);
  }
}

export const api = new OpenAPi();
