import axios from 'axios';

const API_URL = 'http://localhost:8080/api/salaries';

export const SalaryService = {
  getAllSalary: async () => {
    return axios.get(API_URL);
  },

  createSalary: async (salary) => {
    return axios.post(API_URL, salary);
  },

  updateSalary: async (id, salary) => {
    return axios.put(`${API_URL}/${id}`, salary);
  },

  deleteSalary: async (id) => {
    return axios.delete(`${API_URL}/${id}`);
  },
};