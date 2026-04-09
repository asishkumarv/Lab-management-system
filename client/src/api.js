import axios from "axios";

const API = "https://lab-management-system-nz8y.onrender.com";

export const loginUser = (data) => axios.post(`${API}/login`, data);
export const registerUser = (data) => axios.post(`${API}/register`, data);

export const getDashboard = (token) =>
  axios.get(`${API}/dashboard`, {
    headers: { Authorization: token },
  });

export const addPatient = async (data) => {
  return await axios.post(`${API}/patients`, data);
};

export const getPatients = () =>
  axios.get(`${API}/patients`);

export const addTest = (data) =>
  axios.post(`${API}/tests`, data);

export const getTests = () =>
  axios.get(`${API}/tests`);