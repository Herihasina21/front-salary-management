import axios from 'axios';

const API_URL = 'http://localhost:8080/api/payrolls';

export const PayrollService = {
    getAllPayrolls: async () => {
        return axios.get(API_URL);
    },

    createPayroll: async (payroll) => {
        return axios.post(API_URL, payroll);
    },

    updatePayroll: async (id, payroll) => {
        return axios.put(`${API_URL}/${id}`, payroll);
    },

    deletePayroll: async (id) => {
        return axios.delete(`${API_URL}/${id}`);
    },
};