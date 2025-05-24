<template>
  <div class="flex h-screen bg-gray-100 overflow-hidden">
    <!-- Copilot 风格 Chat 面板 - 移到左侧 -->
    <CopilotChatPanel
        :isOpen="chatPanelOpen"
        @close="closeChatPanel"
    />

    <!-- Copilot 风格侧边栏 -->
    <CopilotSidebar @changeChatVisible="changeChatVisible" />

    <!-- 主内容区 -->
    <div
        class="flex-1 flex flex-col transition-all duration-300"
        :class="{ 'ml-96': chatPanelOpen }"
    >
      <!-- 顶部导航栏 -->
      <header class="bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
        <div class="flex items-center space-x-4">
          <h1 class="text-xl font-semibold text-gray-900">智能诊疗辅助系统</h1>
        </div>

        <!-- 右上角用户信息 -->
        <div class="flex items-center space-x-4">
          <UserAvatar></UserAvatar>
        </div>
      </header>

      <!-- 病历内容区 -->
      <main class="flex-1 overflow-y-auto p-6">
        <div class="max-w-4xl mx-auto space-y-6">
          <!-- 患者基本信息 -->
          <PatientInfoCard />

          <!-- 病史信息 -->
          <MedicalHistoryCard />

          <!-- 症状描述 -->
          <SymptomsCard />

          <!-- AI辅助区域 -->
          <div class="grid grid-cols-1 gap-6">
            <!-- 开药建议 -->
            <MedicationRecommendationCard />

            <!-- 开药逻辑 -->
            <MedicationLogicCard />

            <!-- 保健建议 -->
            <HealthAdviceCard />
          </div>
        </div>
      </main>
    </div>

    <!-- Toast 通知 -->
    <Toast
        :message="toastMessage"
        :type="toastType"
        :show="showToast"
        @hide="showToast = false"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, provide } from 'vue';
import CopilotSidebar from '../components/medical/CopilotSidebar.vue';
import PatientInfoCard from '../components/medical/PatientInfoCard.vue';
import MedicalHistoryCard from '../components/medical/MedicalHistoryCard.vue';
import SymptomsCard from '../components/medical/SymptomsCard.vue';
import MedicationRecommendationCard from '../components/medical/MedicationRecommendationCard.vue';
import MedicationLogicCard from '../components/medical/MedicationLogicCard.vue';
import HealthAdviceCard from '../components/medical/HealthAdviceCard.vue';
import CopilotChatPanel from '../components/medical/CopilotChatPanel.vue';
import UserAvatar from "../components/chatpage-components/UserAvatar.vue";
import Toast from '../components/common/Toast.vue';

const chatPanelOpen = ref(false);
const showToast = ref(false);
const toastMessage = ref('');
const toastType = ref<'success' | 'like' | 'dislike'>('success');

const changeChatVisible = () => {
  console.log('Chat panel toggled');
  chatPanelOpen.value = !chatPanelOpen.value;
};

const closeChatPanel = () => {
  chatPanelOpen.value = false;
};

// 提供Toast功能给子组件
const showToastNotification = (message: string, type: 'success' | 'like' | 'dislike' = 'success') => {
  toastMessage.value = message;
  toastType.value = type;
  showToast.value = true;
};

provide('showToast', showToastNotification);
</script>
