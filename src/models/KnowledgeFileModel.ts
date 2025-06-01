export interface KnowledgeFileResponse {
  success?: boolean;
  message?: string;
  file_id?: number;
  file_name?: string;
  file_type?: string;
  index_name?: string;
  entry_count?: number;
  uploaded_at?: string;
}

export interface KnowledgeFileUploadParams {
  file: File;
} 