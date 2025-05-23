import axios from 'axios';
import type { KnowledgeFileResponse } from '../models/KnowledgeFileModel';
import { CURRENT_ENVIRONMENT } from "./EnvironmentPrefix";
import { KNOWLEDGE_MODULE } from "./ComponentPrefix";

const BASE_URL = CURRENT_ENVIRONMENT + KNOWLEDGE_MODULE;

/**
 * 上传问答知识库文件
 */
export async function uploadQaFile(file: File, indexName?: string): Promise<KnowledgeFileResponse> {
  const formData = new FormData();
  formData.append('file', file);
  
  if (indexName) {
    formData.append('index_name', indexName);
  }
  
  return axios.post(`${BASE_URL}/qa`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  }).then((response: any) => {
    return response.data as KnowledgeFileResponse;
  }).catch((error: any) => {
    console.error("Error in uploadQaFile:", error);
    throw error;
  });
}

/**
 * 上传医生知识库文件
 */
export async function uploadDoctorFile(file: File, indexName?: string): Promise<KnowledgeFileResponse> {
  const formData = new FormData();
  formData.append('file', file);
  
  if (indexName) {
    formData.append('index_name', indexName);
  }
  
  return axios.post(`${BASE_URL}/doctor`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  }).then((response: any) => {
    return response.data as KnowledgeFileResponse;
  }).catch((error: any) => {
    console.error("Error in uploadDoctorFile:", error);
    throw error;
  });
}

/**
 * 获取知识库文件列表
 */
export async function getKnowledgeFiles(fileType?: string, skip: number = 0, limit: number = 100): Promise<KnowledgeFileResponse[]> {
  let url = `${BASE_URL}?skip=${skip}&limit=${limit}`;
  
  if (fileType) {
    url += `&file_type=${fileType}`;
  }
  
  return axios.get(url)
    .then((response: any) => {
      return response.data as KnowledgeFileResponse[];
    })
    .catch((error: any) => {
      console.error("Error in getKnowledgeFiles:", error);
      throw error;
    });
} 