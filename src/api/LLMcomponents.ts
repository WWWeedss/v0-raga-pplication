import axios from 'axios';

import type {LLMResponse} from '../models/LLMResponseModels';
import {CURRENT_ENVIRONMENT} from "./EnvironmentPrefix.ts";
import {QUERY_MODULE} from "./ComponentPrefix.ts";

const BASE_URL = CURRENT_ENVIRONMENT + QUERY_MODULE;

export function ragQuery(query_str: string, top_k: number = 3): Promise<LLMResponse> {
    return axios.post(`${BASE_URL}/ragQuery`, {
        query_str: query_str,
        top_k: top_k
    }).then((response) => {
        return response.data as LLMResponse;
    }).catch((error) => {
        console.error("Error in ragQuery:", error);
        throw error;
    })
}