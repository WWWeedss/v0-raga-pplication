// src/stores/sessionStore.ts
import { defineStore } from 'pinia';

import type {SessionRecordModel} from "../models/SessionRecordModel.ts";
import {createSessionRecord, getSessionRecordByUserId, updateSingleSessionRecord} from "../api/SessionComponents.ts";
import type {UserModel} from "../models/UserModel.ts";

const userData:UserModel = JSON.parse(localStorage.getItem('userData') || '{}');

export const useSessionStore = defineStore('session', {
    state: () => ({
        sessions: [] as SessionRecordModel[], // 会话记录列表
        currentSessionIndex: -1, // 当前选择的会话索引, 初始为 -1
    }),
    actions: {
        async fetchSessions(){
            this.sessions = await getSessionRecordByUserId(userData.user_id)
        },
        // 获取当前的对话记录
        getCurrentSession(): SessionRecordModel | null {
            if (this.currentSessionIndex === -1 || this.currentSessionIndex >= this.sessions.length) {
                return null;
            }
            return this.sessions[this.currentSessionIndex];
        },
        // 修改当前选中的会话索引
        setCurrentSessionIndex(index: number): void {
            this.currentSessionIndex = index;
        },
        // 添加新的会话
        async addSession(session: SessionRecordModel): Promise<void> {
            const new_session = await createSessionRecord(session)
            // 添加 index = 0 的位置
            this.sessions.unshift(new_session);
            console.log(this.sessions)
            this.currentSessionIndex = 0; // 设置为新添加的会话索引
        },
        // 修改当前会话记录
        async updateSession(session: SessionRecordModel): Promise<void> {
            this.sessions[this.currentSessionIndex] = session;
            // 调用远程接口更新会话记录
            await updateSingleSessionRecord(session);
        },
    },
});
