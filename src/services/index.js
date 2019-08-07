import axios from "axios";

export function getUsers(username) {
    return axios.post('http://localhost:3001/users',{ username }).then(result => new Promise((resolve, reject) => {
        resolve(username);
    })).catch(error => {return username})
}