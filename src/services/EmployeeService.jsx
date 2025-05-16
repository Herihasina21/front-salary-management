import api from './Api.jsx';

export const EmployeeService = {
  getAllEmployees: async () => {
    return api.get('/departments');
  },

  createEmployee: async (employee) => {
    return api.post('/departments', employee);
  },

  updateEmployee: async (id, employee) => {
    return api.put(`/departments/${id}`, employee);
  },

  deleteEmployee: async (id) => {
    return api.delete(`/departments/${id}`);
  },
};
