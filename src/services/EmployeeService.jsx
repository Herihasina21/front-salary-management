import api from './Api.jsx';

const API_URL = 'http://localhost:8080/api/employees';

export const EmployeeService = {
  getAllEmployees: async () => {
    return api.get(API_URL);
  },

  createEmployee: async (employee) => {
    return api.post(API_URL, employee);
  },

  updateEmployee: async (id, employee) => {
    return api.put(`${API_URL}/${id}`, employee);
  },

  deleteEmployee: async (id) => {
    return api.delete(`${API_URL}/${id}`);
  },
};
