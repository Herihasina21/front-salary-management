import api from './Api.jsx';
const API_URL = 'http://localhost:8080/api/bonus';

export const BonusService = {
    getAllBonus: async () => {
        return api.get(API_URL);
    },

    createBonus: async (bonus) => {
        return api.post(API_URL, bonus);
    },

    updateBonus: async (id, bonus) => {
        return api.put(`${API_URL}/${id}`, bonus);
    },

    deleteBonus: async (id) => {
        return api.delete(`${API_URL}/${id}`);
    },
};
