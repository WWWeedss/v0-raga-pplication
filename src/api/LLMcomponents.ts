import axios from 'axios';

import type {LLMResponse, PatientInfo} from '../models/LLMResponseModels';
import {CURRENT_ENVIRONMENT} from "./EnvironmentPrefix.ts";
import {QUERY_MODULE} from "./ComponentPrefix.ts";
import type {MessageItem} from "../models/SessionRecordModel.ts";

const BASE_URL = CURRENT_ENVIRONMENT + QUERY_MODULE;


export async function ragQuery(query_str: string): Promise<LLMResponse> {
    const top_k = localStorage.getItem('top_k')? parseInt(localStorage.getItem('top_k') as string) : 3;
    return axios.post(`${BASE_URL}/ragQuery`, {
        query_str: query_str,
        top_k: top_k
    }).then((response) => {
        return response.data as LLMResponse;
    }).catch((error) => {
        console.error("Error in ragQuery:", error);
        throw error;
    });
}

export async function ragQueryWithHistory(chatHistory: MessageItem[]): Promise<LLMResponse> {
    const top_k = localStorage.getItem('top_k')? parseInt(localStorage.getItem('top_k') as string) : 3;
    return axios.post(`${BASE_URL}/ragQueryWithHistory`, {
        chat_history: chatHistory,
        top_k: top_k
    }).then((response) => {
        return response.data as LLMResponse;
    }).catch((error) => {
        console.error("Error in ragQueryWithHistory:", error);
        throw error;
    });
}

export async function analysePatientInfo(query_str: string){
    return axios.post(`${BASE_URL}/analysePatientInfo`, {
        query_str: query_str
    }).then((response) => {
        return response.data as PatientInfo;
    }).catch((error) => {
        console.error("Error in analysePatientInfo:", error);
        throw error;
    });
}

export async function ragQueryForDrugAdvise (query_str: string): Promise<string> {
    const top_k = localStorage.getItem('top_k')? parseInt(localStorage.getItem('top_k') as string) : 3;
    return axios.post(`${BASE_URL}/ragQueryForDrugAdvise`, {
        query_str: query_str,
        top_k: top_k
    }).then((response) => {
        return response.data.answer;
    }).catch((error) => {
        console.error("Error in ragQueryForDrugAdvise:", error);
        throw error;
    });
}

export async function ragQueryForDrugLogic (query_str: string): Promise<string> {
    const top_k = localStorage.getItem('top_k')? parseInt(localStorage.getItem('top_k') as string) : 3;
    return axios.post(`${BASE_URL}/ragQueryForDrugLogic`, {
        query_str: query_str,
        top_k: top_k
    }).then((response) => {
        return response.data.answer;
    }).catch((error) => {
        console.error("Error in ragQueryForDrugLogic:", error);
        throw error;
    });
}

export async function ragQueryForHealthAdvice (query_str: string): Promise<string> {
    const top_k = localStorage.getItem('top_k')? parseInt(localStorage.getItem('top_k') as string) : 3;
    return axios.post(`${BASE_URL}/ragQueryForHealthAdvise`, {
        query_str: query_str,
        top_k: top_k
    }).then((response) => {
        return response.data.answer;
    }).catch((error) => {
        console.error("Error in ragQueryForHealthAdvise:", error);
        throw error;
    });
}