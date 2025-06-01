import axios from "axios"
import type { KnowledgeFileResponse } from "../models/KnowledgeFileModel"
import { CURRENT_ENVIRONMENT } from "./EnvironmentPrefix"
import { KNOWLEDGE_MODULE } from "./ComponentPrefix"

const BASE_URL = CURRENT_ENVIRONMENT + KNOWLEDGE_MODULE

/**
 * 上传问答知识库文件
 */
export async function uploadQaFile(file: File): Promise<KnowledgeFileResponse> {
  const formData = new FormData()
  formData.append("file", file)

  return axios
      .post(`${BASE_URL}/qa`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response: any) => {
        return response.data as KnowledgeFileResponse
      })
      .catch((error: any) => {
        console.error("Error in uploadQaFile:", error)
        throw error
      })
}

/**
 * 上传药品知识库文件
 */
export async function uploadPharmaceuticalFile(file: File): Promise<KnowledgeFileResponse> {
  const formData = new FormData()
  formData.append("file", file)

  return axios
      .post(`${BASE_URL}/pharmaceutical`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response: any) => {
        return response.data as KnowledgeFileResponse
      })
      .catch((error: any) => {
        console.error("Error in uploadPharmaceuticalFile:", error)
        throw error
      })
}

/**
 * 上传保健知识库文件
 */
export async function uploadHealthFile(file: File): Promise<KnowledgeFileResponse> {
  const formData = new FormData()
  formData.append("file", file)

  return axios
      .post(`${BASE_URL}/health`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response: any) => {
        return response.data as KnowledgeFileResponse
      })
      .catch((error: any) => {
        console.error("Error in uploadHealthFile:", error)
        throw error
      })
}

/**
 * 获取知识库文件列表
 */
export async function getKnowledgeFiles(fileType?: string, skip = 0, limit = 100): Promise<KnowledgeFileResponse[]> {
  let url = `${BASE_URL}?skip=${skip}&limit=${limit}`

  if (fileType) {
    url += `&file_type=${fileType}`
  }

  return axios
      .get(url)
      .then((response: any) => {
        return response.data as KnowledgeFileResponse[]
      })
      .catch((error: any) => {
        console.error("Error in getKnowledgeFiles:", error)
        throw error
      })
}

export async function getKnowledgeFile(filename: string){
    return axios.get(`${BASE_URL}/getFile/${filename}`).then((response: any) => {
        return response.data;
    }).catch((error: any) => {
        console.error("Error in getKnowledgeFile:", error);
        throw error;
    });
}