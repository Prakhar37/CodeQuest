import axios from 'axios';
//const API_URL = 'http://localhost:3000/api/problems';
const API_URL = 'http://13.201.94.103:3000/api/problems';

export const createProblem = (problemData) => {
    return axios.post(`${API_URL}/create`, problemData);
};

export const getProblems = () => {
    return axios.get(API_URL);
};

export const getProblemById = (id) => {
    return axios.get(`${API_URL}/${id}`);
};

export const updateProblem = (id, problemData) => {
    return axios.put(`${API_URL}/${id}`, problemData);
};

export const deleteProblem = (id) => {
    return axios.delete(`${API_URL}/${id}`);
};
  
  
  