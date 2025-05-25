import {defineStore} from 'pinia'

export const useReportStore = defineStore("report",{
    state: () => ({
        patientName : "",
        patientAge : "",
        patientGender : "",
        //过往病史
        medicalHistory : "",
        //症状描述
        symptomsDescription : "",
        //审核后开药建议
        drugAdvice : "",
        //审核后开药逻辑
        drugLogic : "",
        //审核后保健建议
        healthAdvice : "",
    }),
    actions: {
    },
    persist: true,
})