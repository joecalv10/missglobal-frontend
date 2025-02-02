import axios from "axios";
import jwt_decode from "jwt-decode";
let isRefresh = false;
import { getCookie, deleteCookie, setCookie } from "cookies-next";

const isTokenExpired = (t) => Date.now() >= jwt_decode(t || "null").exp * 1000;

const forceLogout = () => {
  deleteCookie("accessToken");
  deleteCookie("refreshToken");
  window.location.reload();
};

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    Authorization: `JWT ${getCookie("accessToken")}`,
    "Content-Type": "application/json",
    accept: "application/json",
  },
});

axiosInstance.interceptors.request.use(async (config) => {
  if (!config.url) return config;

  if (!isRefresh) {
    let accessToken = getCookie("accessToken");

    if (!accessToken || isTokenExpired(accessToken)) {
      const { data, status } = await axios.post(
        process.env.NEXT_PUBLIC_API_URL + "/auth/refresh",
        {
          refresh: getCookie("refreshToken"),
        }
      );
      status === 200 ? (accessToken = data.message) : forceLogout();
      setCookie("accessToken", data.message, {
        expires: new Date(Date.now() + 7 * 24 * 3600 * 1000),
        path: "/",
      });
    }

    if (accessToken) config.headers["Authorization"] = `JWT ${accessToken}`;
  }

  if (isRefresh) isRefresh = false;

  return config;
});

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const { response, config } = error;
    if (response.status === 401 && !isRefresh) {
      if (
        !getCookie("refreshToken") ||
        isTokenExpired(getCookie("refreshToken"))
      )
        forceLogout();

      const accessToken = getCookie("accessToken");

      if (!accessToken || isTokenExpired(accessToken)) {
        try {
          const { data } = await axios.post(
            process.env.NEXT_PUBLIC_API_URL + "/refresh",
            {
              refresh: getCookie("refreshToken"),
            }
          );
          isRefresh = true;
          setCookie("accessToken", data.message, {
            expires: new Date(Date.now() + 7 * 24 * 3600 * 1000),
            path: "/",
          });
          config.headers["Authorization"] = `JWT ${data.message}`;
          return axios(config);
        } catch (error) {
          forceLogout();
        }
      }
      isRefresh = true;
    }

    isRefresh = false;
    if (response.status === 401) forceLogout();

    // eslint-disable-next-line no-undef
    return Promise.reject(error);
  }
);

export default axiosInstance;
