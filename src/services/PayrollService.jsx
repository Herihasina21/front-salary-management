import api from './Api.jsx';

const API_URL = 'http://localhost:8080/api/payrolls';

export const PayrollService = {
    getAllPayrolls: async () => {
        return api.get(API_URL);
    },

    createPayroll: async (payroll) => {
        return api.post(API_URL, payroll);
    },

    updatePayroll: async (id, payroll) => {
        return api.put(`${API_URL}/${id}`, payroll);
    },

    deletePayroll: async (id) => {
        return api.delete(`${API_URL}/${id}`);
    },

    downloadPayroll: async (id) => {
        return api.get(`${API_URL}/${id}/pdf`, { responseType: 'blob' });
    },

    sendPayrollEmail: async (id, email) => {
        return api.get(`${API_URL}/${id}/email`, { email });
    },

    sendPayrollEmailToAll: async () => {
        return api.post(`${API_URL}/send-all`);
    }

};
