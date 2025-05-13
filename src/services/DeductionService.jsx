import api from './Api.jsx';

const API_URL = 'http://localhost:8080/api/deductions';

export const DeductionService = {
    getAllDeduction: async () => {
        return api.get(API_URL);
    },

    createDeduction: async (deduction) => {
        return api.post(API_URL, deduction);
    },

    updateDeduction: async (id, deduction) => {
        return api.put(`${API_URL}/${id}`, deduction);
    },

    deleteDeduction: async (id) => {
        return ap.delete(`${API_URL}/${id}`);
    },
};
