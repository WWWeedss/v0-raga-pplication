export interface Message {
    role: 'user' | 'assistant';
    content: string;
}

export interface SessionRecordModel{
    session_id: number,
    user_id: number,
    session_data: Message[],
}