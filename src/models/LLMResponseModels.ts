export interface source_document {
    content: string;
    metadata: {
        query: string;
        response: string;
    };
    score: number;
}

export interface LLMResponse {
    answer: string;
    source_documents: source_document[];
}

export interface Message {
    content: string;
    isUser: boolean;
    source_documents?: source_document[];
}