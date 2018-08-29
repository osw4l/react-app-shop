const LOCAL = 'http://localhost:8000';
const SERVER = 'https://react-django-shop.herokuapp.com';
const DOMAIN = SERVER;
export default DOMAIN;
export function getToken() {
    return localStorage.getItem('token');
}