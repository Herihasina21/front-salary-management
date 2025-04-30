import axios from 'axios';

const API_URL = 'http://localhost:8080/api/employees';

export const EmployeeService = {
  getAllEmployees: async () => {
    return axios.get(API_URL);
  },

  createEmployee: async (employee) => {
    return axios.post(API_URL, employee);
  },

  updateEmployee: async (id, employee) => {
    return axios.put(`${API_URL}/${id}`, employee);
  },

  deleteEmployee: async (id) => {
    return axios.delete(`${API_URL}/${id}`);
  },
};
