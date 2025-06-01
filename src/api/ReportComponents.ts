import {ragQueryForDrugAdvise, ragQueryForDrugLogic, ragQueryForHealthAdvice} from "./LLMcomponents.ts";
import type {ReportStore} from "../stores/reportStore.ts";


export async function generateMedicalAdviceResponse(reportStore : ReportStore, doctorRequirement = '') {
    const prompt = "患者信息：" + reportStore.getPatientInfoPrompt() + "\n" +
        "医生要求：" + doctorRequirement + "\n" +
        "请根据以上信息生成保健建议。";

    return await ragQueryForHealthAdvice(prompt);
}

export async function generateMedicalRecommendationResponse(reportStore : ReportStore, doctorRequirement = '') {
    const prompt = "患者情况: " + reportStore.getPatientInfoPrompt() + "\n"
        +"医生要求:" + doctorRequirement + "\n"
        +"请根据患者情况和医生要求生成严谨、合理、友善的开药建议" + "\n"
    ;
    return await ragQueryForDrugAdvise(prompt);
}

export async function generateMedicalLogicResponse(reportStore : ReportStore, doctorRequirement = '') {
    const prompt = "患者情况：" + reportStore.getPatientInfoPrompt() + "\n" +
        "开药单据：" + reportStore.drugAdvice + "\n" +
        "医生要求：" + doctorRequirement + "\n" +
        "请根据以上信息生成开药逻辑。";
    return await ragQueryForDrugLogic(prompt);
}