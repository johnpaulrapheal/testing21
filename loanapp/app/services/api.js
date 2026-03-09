import axios from "axios";

const apiBaseURLRaw =
  process.env.EXPO_PUBLIC_API_BASE_URL?.trim() || "/api";
const apiBaseURL = apiBaseURLRaw.endsWith("/")
  ? apiBaseURLRaw
  : `${apiBaseURLRaw}/`;

const API = axios.create({
  baseURL: apiBaseURL
});

export const testApi = () => API.get("test/");
export const getCustomers = () => API.get("customers/");
export const getPayments = () => API.get("payments/");
export const getPaymentHistory = (account_number) =>
  API.get(`payments/${account_number}/`);

export default API;
