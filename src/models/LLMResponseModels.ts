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

export interface PatientInfo {
    patient_name: string;
    patient_age: string;
    patient_gender: string;
    patient_medical_history: string;
}