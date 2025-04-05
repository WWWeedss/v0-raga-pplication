import axios from 'axios';

import type { UserModel } from '../models/UserModel';
import {USER_MODULE} from "./ComponentPrefix.ts";
import {CURRENT_ENVIRONMENT} from "./EnvironmentPrefix.ts";

const BASE_URL = CURRENT_ENVIRONMENT + USER_MODULE;

export function register(user: UserModel) {
    return axios.post(`${BASE_URL}/register`, user)
}

export function login(user: UserModel) {
    return axios.post(`${BASE_URL}/login`, user)
}

export function logout() {
    return axios.post(`${BASE_URL}/logout`)
}

export function getCurrentUser() {
    return axios.get(`${BASE_URL}/getCurrentUser`)
}