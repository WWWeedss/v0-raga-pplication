<template>
  <div class="w-12 bg-gray-800 flex flex-col items-center py-4 space-y-4">
    <!-- 上传病历 -->
    <SidebarIcon
        :icon="Upload"
        tooltip="上传病历"
        @click="openUploadModal"
    />

    <!-- 导出报告 -->
    <SidebarIcon
        :icon="Download"
        tooltip="导出报告"
        @click="openExportModal"
    />

    <!-- Chat -->
    <SidebarIcon
        :icon="MessageSquare"
        tooltip="AI助手"
        @click="$emit('changeChatVisible')"
    />

    <!-- 知识库管理 -->
    <SidebarIcon
        :icon="Database"
        tooltip="知识库管理"
        @click="openKnowledgeModal"
    />

    <!-- 系统设置 -->
    <SidebarIcon
        :icon="Settings"
        tooltip="系统设置"
        @click="openSettingsModal"
    />

    <!-- 弹窗组件 -->
    <UploadModal :isOpen="uploadModalOpen" @close="uploadModalOpen = false" />
    <ExportModal :isOpen="exportModalOpen" @close="exportModalOpen = false" />
    <KnowledgeModal :isOpen="knowledgeModalOpen" @close="knowledgeModalOpen = false" />
    <SettingsModal :isOpen="settingsModalOpen" @close="settingsModalOpen = false" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { Upload, Download, MessageSquare, Database, Settings } from 'lucide-vue-next';
import SidebarIcon from '../SidebarIcon.vue';
import UploadModal from '../UploadModal.vue';
import ExportModal from '../ExportModal.vue';
import KnowledgeModal from '../KnowledgeModal.vue';
import SettingsModal from '../../chatpage-components/SettingsModal.vue';

defineEmits(['changeChatVisible']);

const uploadModalOpen = ref(false);
const exportModalOpen = ref(false);
const knowledgeModalOpen = ref(false);
const settingsModalOpen = ref(false);

const openUploadModal = () => {
  uploadModalOpen.value = true;
};

const openExportModal = () => {
  exportModalOpen.value = true;
};

const openKnowledgeModal = () => {
  knowledgeModalOpen.value = true;
};

const openSettingsModal = () => {
  settingsModalOpen.value = true;
};
</script>
