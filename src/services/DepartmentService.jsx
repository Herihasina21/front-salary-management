import axios from 'axios';

const API_URL = 'http://localhost:8080/api/departments';

export const DepartmentService = {
    getAllDepartments: async () => {
        return axios.get(API_URL);
    },

    createDepartment: async (department) => {
        return axios.post(API_URL, department);
    },

    updateDepartment: async (id, department) => {
        return axios.put(`${API_URL}/${id}`, department);
    },

    deleteDepartment: async (id) => {
        return axios.delete(`${API_URL}/${id}`);
    },
};
