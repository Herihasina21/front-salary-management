import api from './Api.jsx';

const API_URL = 'http://localhost:8080/api/salaries';

export const SalaryService = {
  getAllSalary: async () => {
    return api.get(API_URL);
  },

  createSalary: async (salary) => {
    return api.post(API_URL, salary);
  },

  updateSalary: async (id, salary) => {
    return api.put(`${API_URL}/${id}`, salary);
  },

  deleteSalary: async (id) => {
    return api.delete(`${API_URL}/${id}`);
  },
};
