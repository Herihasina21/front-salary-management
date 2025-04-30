import axios from 'axios';

const API_URL = 'http://localhost:8080/api/deductions';

export const DeductionService = {
    getAllDeduction: async () => {
        return axios.get(API_URL);
    },

    createDeduction: async (deduction) => {
        return axios.post(API_URL, deduction);
    },

    updateDeduction: async (id, deduction) => {
        return axios.put(`${API_URL}/${id}`, deduction);
    },

    deleteDeduction: async (id) => {
        return axios.delete(`${API_URL}/${id}`);
    },
};