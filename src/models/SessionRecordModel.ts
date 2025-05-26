import type{source_document} from "./LLMResponseModels.ts";

export interface MessageItem {
    role: 'user' | 'assistant';
    content: string;
    source_documents?: source_document[];
    liked?: boolean;
    disliked?: boolean;
}

export interface SessionRecordModel{
    session_id?: number,
    user_id?: number,
    session_data: MessageItem[],
    timestamp: string
}