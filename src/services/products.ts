import axios from "axios";
import config from "../config/config";
import { CONTACT, PRODUCT } from "../constants/backend.constants";

type ListProductApi = {
  query?: Record<string, any>;
};

type ListContactApi = {
  query?: Record<string, any>;
};

const listProducts = (args?: ListProductApi) => {
  let url = config.BACKEND_BASE + PRODUCT.LIST;

  let query = args?.query || {};
  return axios.get(url, {
    params: query,
  });
};

const listContacts = (args?: ListContactApi) => {
  let url = config.BACKEND_BASE + CONTACT.LIST;

  let query = args?.query || {};
  return axios.get(url, {
    params: query,
  });
};

export { listProducts, listContacts };
