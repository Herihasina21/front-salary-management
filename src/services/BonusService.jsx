import axios from 'axios';

const API_URL = 'http://localhost:8080/api/bonus';

export const BonusService = {
    getAllBonus: async () => {
        return axios.get(API_URL);
    },

    createBonus: async (bonus) => {
        return axios.post(API_URL, bonus);
    },

    updateBonus: async (id, bonus) => {
        return axios.put(`${API_URL}/${id}`, bonus);
    },

    deleteBonus: async (id) => {
        return axios.delete(`${API_URL}/${id}`);
    },
};