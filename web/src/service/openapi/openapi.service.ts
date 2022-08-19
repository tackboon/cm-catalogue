import axios, { AxiosError } from "axios";

import { store } from "../../store/store";
import { signOutStart } from "../../store/user/user.action";
import { Configuration as UserConfig, UserApi } from "../../openapi/user";
import {
  Configuration as CustomerConfig,
  CustomerApi,
  CashBookApi,
} from "../../openapi/customer";

const API_HOST = process.env.REACT_APP_API_HOST || "http://localhost";
const BASE_PATH = {
  userAPI: API_HOST + "/api/v1/users",
  customerAPI: API_HOST + "/api/v1/customers",
};

const customAxios = axios.create();

customAxios.interceptors.response.use(
  (res) => res,
  (error) => {
    if ((error as AxiosError).response?.status === 401) {
      store.dispatch(signOutStart());
    }

    return Promise.reject(
      (error as AxiosError).response ? error.response.data.slug : error.message
    );
  }
);

class OpenAPi {
  accessToken = "";
  UserAPI: UserApi;
  CustomerAPI: CustomerApi;
  CashBookAPI: CashBookApi;

  constructor() {
    this.UserAPI = new UserApi(
      new UserConfig({ accessToken: "" }),
      BASE_PATH.userAPI,
      customAxios
    );
    this.CustomerAPI = new CustomerApi(
      new CustomerConfig({ accessToken: "" }),
      BASE_PATH.customerAPI,
      customAxios
    );
    this.CashBookAPI = new CashBookApi(
      new CustomerConfig({ accessToken: "" }),
      BASE_PATH.customerAPI,
      customAxios
    );
  }

  setAuthConfig(accessToken: string) {
    this.accessToken = accessToken;

    this.setUserAPI();
    this.setCustomerAPI();
  }

  setUserAPI() {
    const configuration = new UserConfig({
      accessToken: this.accessToken,
    });

    this.UserAPI = new UserApi(configuration, BASE_PATH.userAPI, customAxios);
  }

  setCustomerAPI() {
    const configuration = new CustomerConfig({
      accessToken: this.accessToken,
    });

    this.CustomerAPI = new CustomerApi(
      configuration,
      BASE_PATH.customerAPI,
      customAxios
    );

    this.CashBookAPI = new CashBookApi(
      configuration,
      BASE_PATH.customerAPI,
      customAxios
    );
  }
}

export const api = new OpenAPi();
