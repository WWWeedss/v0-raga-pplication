export interface MessageItem{
    role: 'user' | 'assistant',
    msg: string,
}

export interface SessionRecordModel{
    session_id: number,
    user_id: number,
    session_data: MessageItem[],
}