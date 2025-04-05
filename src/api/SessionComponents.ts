import axios from "axios";
import type { SessionRecordModel } from "../models/SessionRecordModel.ts";
import {CURRENT_ENVIRONMENT, SESSION_MODULE} from "./ComponentPrefix.ts";

const BASE_URL = CURRENT_ENVIRONMENT + SESSION_MODULE;

export function getSessionRecordById(sessionId: number) {
    return axios.get<SessionRecordModel>(`${BASE_URL}/${sessionId}`);
}

