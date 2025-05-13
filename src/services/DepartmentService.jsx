import api from './Api.jsx';

const API_URL = 'http://localhost:8080/api/departments';

export const DepartmentService = {
    getAllDepartments: async () => {
        return api.get(API_URL);
    },

    createDepartment: async (department) => {
        return api.post(API_URL, department);
    },

    updateDepartment: async (id, department) => {
        return api.put(`${API_URL}/${id}`, department);
    },

    deleteDepartment: async (id) => {
        return api.delete(`${API_URL}/${id}`);
    },
};
