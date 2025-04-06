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