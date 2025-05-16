import api from './Api.jsx';

export const SalaryService = {
  getAllSalary: async () => {
    return api.get('/payrolls');
  },

  createSalary: async (salary) => {
    return api.post('/payrolls', salary);
  },

  updateSalary: async (id, salary) => {
    return api.put(`/payrolls/${id}`, salary);
  },

  deleteSalary: async (id) => {
    return api.delete(`/payrolls/${id}`);
  },
};
