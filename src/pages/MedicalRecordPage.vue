<template>
  <div class="flex h-screen bg-gray-100 overflow-hidden">
    <!-- Copilot 风格 Chat 面板 - 移到左侧 -->
    <div
        v-if="chatPanelOpen"
        class="fixed left-12 top-0 h-full bg-gray-800 overflow-hidden z-20 text-white flex transition-none"
        :style="{ width: `${chatPanelWidth}px` }"
    >
      <CopilotChatPanel
          :isOpen="chatPanelOpen"
          @close="closeChatPanel"
          class="flex-1"
      />

      <!-- 拖拽手柄 -->
      <div
          @mousedown="startResize"
          class="w-1 bg-gray-600 hover:bg-gray-500 cursor-col-resize transition-colors relative group"
          :class="{ 'bg-gray-400': isResizing }"
      >
        <div class="absolute inset-y-0 -left-2 -right-2"></div>
        <!-- 拖拽指示器 -->
        <div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
          <div class="w-0.5 h-8 bg-white rounded-full"></div>
        </div>
      </div>
    </div>

    <!-- Copilot 风格侧边栏 -->
    <CopilotSidebar @changeChatVisible="changeChatVisible" />

    <!-- 主内容区 -->
    <div
        class="flex-1 flex flex-col"
        :style="{
          marginLeft: chatPanelOpen ? `${chatPanelWidth}px` : '0px',
          transition: chatPanelOpen ? 'none' : 'margin-left 0.3s ease-in-out'
        }"
    >
      <!-- 顶部导航栏 - 移除左边距，让它紧贴侧边栏 -->
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

          <!-- AI智能生成控制 -->
          <AIGenerationCard />

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
import { ref, provide, onMounted, onUnmounted } from 'vue';
import CopilotSidebar from '../components/medical/chat/CopilotSidebar.vue';
import PatientInfoCard from '../components/medical/cards/PatientInfoCard.vue';
import MedicalHistoryCard from '../components/medical/cards/MedicalHistoryCard.vue';
import SymptomsCard from '../components/medical/cards/SymptomsCard.vue';
import MedicationRecommendationCard from '../components/medical/cards/MedicationRecommendationCard.vue';
import MedicationLogicCard from '../components/medical/cards/MedicationLogicCard.vue';
import HealthAdviceCard from '../components/medical/cards/HealthAdviceCard.vue';
import CopilotChatPanel from '../components/medical/chat/CopilotChatPanel.vue';
import UserAvatar from "../components/chatpage-components/UserAvatar.vue";
import Toast from '../components/common/Toast.vue';
import AIGenerationCard from '../components/medical/cards/AIGenerationCard.vue';

const chatPanelOpen = ref(false);
const chatPanelWidth = ref(384); // 默认宽度 384px (w-96)
const isResizing = ref(false);
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

// 拖拽调整大小的逻辑 - 提升灵敏度
const startResize = (e: MouseEvent) => {
  if (!chatPanelOpen.value) return;

  e.preventDefault();
  isResizing.value = true;
  const startX = e.clientX;
  const startWidth = chatPanelWidth.value;

  // 添加用户选择禁用，防止拖拽时选中文本
  document.body.style.userSelect = 'none';
  document.body.style.cursor = 'col-resize';

  const handleMouseMove = (e: MouseEvent) => {
    e.preventDefault();
    const deltaX = e.clientX - startX;
    const newWidth = Math.max(280, Math.min(600, startWidth + deltaX)); // 限制宽度在 280px-600px 之间
    chatPanelWidth.value = newWidth;
  };

  const handleMouseUp = (e: MouseEvent) => {
    e.preventDefault();
    isResizing.value = false;
    document.body.style.userSelect = '';
    document.body.style.cursor = '';
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
  };

  document.addEventListener('mousemove', handleMouseMove);
  document.addEventListener('mouseup', handleMouseUp);
};

onMounted(() => {
  // 防止文本选择在拖拽时
  document.addEventListener('selectstart', (e) => {
    if (isResizing.value) {
      e.preventDefault();
    }
  });

  // 防止拖拽时的默认行为
  document.addEventListener('dragstart', (e) => {
    if (isResizing.value) {
      e.preventDefault();
    }
  });
});

onUnmounted(() => {
  document.removeEventListener('selectstart', () => {});
  document.removeEventListener('dragstart', () => {});
});

// 提供Toast功能给子组件
const showToastNotification = (message: string, type: 'success' | 'like' | 'dislike' = 'success') => {
  toastMessage.value = message;
  toastType.value = type;
  showToast.value = true;
};

provide('showToast', showToastNotification);
</script>
