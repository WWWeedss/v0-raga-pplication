import axios from "axios";
import type { SessionRecordModel } from "../models/SessionRecordModel.ts";
import {SESSION_MODULE} from "./ComponentPrefix.ts";
import {CURRENT_ENVIRONMENT} from "./EnvironmentPrefix.ts";

const BASE_URL = CURRENT_ENVIRONMENT + SESSION_MODULE;

export async function createSessionRecord(sessionData: SessionRecordModel): Promise<SessionRecordModel> {
    return axios.post(`${BASE_URL}/createSessionRecord`, sessionData).then(
        (response) => {
            return response.data as SessionRecordModel;
        }
    ).catch((error) => {
        console.error("Error in createSessionRecord:", error);
        throw error;
    });
}

export async function getSessionRecordByUserId(userId: number | undefined):Promise<SessionRecordModel[]> {
    return axios.get<SessionRecordModel[]>(`${BASE_URL}/getSessionRecordsByUser/${userId}`).then(
        (response) => {
            return response.data as SessionRecordModel[];
        }
    ).catch((error) => {
        console.error("Error in getSessionRecordByUserId:", error);
        throw error;
    });
}

export async function updateSingleSessionRecord(sessionData: SessionRecordModel) {
    return axios.put(`${BASE_URL}/updateSingleSessionRecord`, sessionData).then(
        (response) => {
            return response.data;
        }
    ).catch((error) => {
        console.error("Error in updateSingleSessionRecord:", error);
        throw error;
    });
}

export async function deleteSingleSessionRecord(sessionId: number) {
    return axios.put(`${BASE_URL}/deleteSession/${sessionId}`, ).then(
        (response) => {
            return response.data;
        }
    ).catch((error) => {
        console.error("Error in deleteSingleSessionRecord:", error);
        throw error;
    });
}


