import axios from "axios";
import { IAxiosParams } from "../types";
import { HEADER_APPLICATION_JSON } from "../constants";

export const axiosInstance = axios.create();

export const getResponse = (data: IAxiosParams) => {
  const { method, payload, url, requestHeader, body } = data;
  let config = {
    method: method,
    url: url,
    headers: {
      "Content-Type": "application/json",
      ...requestHeader,
    },
    params: payload,
    data: body,
  };
  return new Promise((resolve, reject) => {
    axiosInstance(config)
      .then((res) => resolve(res))
      .catch((e) => reject(e));
  });
};

export const postResponse = (data: IAxiosParams) => {
  const { method, payload, url } = data;
  let config = {
    method: method,
    url: url,
    headers: HEADER_APPLICATION_JSON,
    data: payload,
  };
  return new Promise((resolve, reject) => {
    axiosInstance(config)
      .then((res) => resolve(res))
      .catch((e) => reject(e));
  });
};
