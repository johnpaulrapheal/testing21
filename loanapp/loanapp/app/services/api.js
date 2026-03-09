import axios from "axios";

const API = axios.create({
  baseURL: "http://127.0.0.1:8000/api/"
});

export const testApi = () => API.get("test/");
export const getCustomers = () => API.get("customers/");
export const getPayments = () => API.get("payments/");
export const getPaymentHistory = (account_number) =>
  API.get(`payments/${account_number}/`);

export default API;