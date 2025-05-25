<template>
  <div class="relative">
    <!-- History Button -->
    <div class="relative group">
      <button
          @click="toggleDropdown"
          class="hover:text-white"
          :class="{ 'text-white': isOpen, 'text-gray-400': !isOpen }"
      >
        <Clock class="h-4 w-4" />
      </button>
      <div class="absolute bottom-6 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
        会话历史
      </div>
    </div>

    <!-- Dropdown Panel -->
    <div
        v-if="isOpen"
        class="absolute top-8 right-0 w-80 bg-gray-900 border border-gray-600 rounded-lg shadow-xl z-50 max-h-96 overflow-hidden"
    >
      <!-- Header -->
      <div class="px-4 py-3 border-b border-gray-700 bg-gray-800">
        <div class="flex items-center justify-between">
          <h3 class="text-sm font-medium text-white">Recent Conversations</h3>
          <button @click="closeDropdown" class="text-gray-400 hover:text-white">
            <X class="h-4 w-4" />
          </button>
        </div>
      </div>

      <!-- Conversations List -->
      <div class="overflow-y-auto max-h-80">
        <div v-if="sessionStore.sessions.length === 0" class="p-6 text-center text-gray-400">
          <MessageSquare class="h-8 w-8 mx-auto mb-2 opacity-50" />
          <p class="text-sm">No conversations yet</p>
        </div>

        <div v-else>
          <div
              v-for="(session, index) in sessionStore.sessions"
              :key="session.session_id"
              @click="selectConversation(index)"
              class="px-4 py-3 hover:bg-gray-800 cursor-pointer border-b border-gray-800 last:border-b-0 transition-colors"
          >
            <div class="flex items-start space-x-3">
              <div class="flex-shrink-0 mt-0.5">
                <MessageSquare class="h-4 w-4 text-gray-400" />
              </div>
              <div class="flex-1 min-w-0">
                <p class="text-sm text-white truncate">
                  {{ getConversationTitle(session) }}
                </p>
                <p class="text-xs text-gray-400 mt-1">
                  {{ formatRelativeTime(session.timestamp) }} • {{ session.session_data.length }} messages
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { Clock, X, MessageSquare } from 'lucide-vue-next';
import { useSessionStore } from '../../stores/sessionStore';
import type { SessionRecordModel } from '../../models/SessionRecordModel';

const emit = defineEmits<{
  (e: 'conversationSelected'): void;
}>();

const sessionStore = useSessionStore();
const isOpen = ref(false);

const toggleDropdown = () => {
  isOpen.value = !isOpen.value;
};

const closeDropdown = () => {
  isOpen.value = false;
};

const selectConversation = (index: number) => {
  const session = sessionStore.sessions[index];
  if (session) {
    sessionStore.setCurrentSessionIndex(index);
    emit('conversationSelected');
    closeDropdown();
  }
};

const getConversationTitle = (session: SessionRecordModel): string => {
  if (session.session_data && session.session_data.length > 0) {
    const firstMessage = session.session_data[0];
    return firstMessage.content.slice(0, 40) + (firstMessage.content.length > 40 ? '...' : '');
  }
  return 'New Conversation';
};

const formatRelativeTime = (timestamp : string): string => {
  if(!timestamp || timestamp.length === 0) {
    return "recently";
  }

  const now = new Date();
  const messageTime = new Date(timestamp);
  const diff = Math.abs(now.getTime() - messageTime.getTime());
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const daysText = days > 0 ? `${days} days` : '';
  const hoursText = hours > 0 ? `${hours} hours` : '';
  const minutesText = minutes > 0 ? `${minutes} minutes` : '';
  if (daysText.length === 0 && hoursText.length === 0 && minutesText.length === 0) {
    return "recently";
  }
  return `${daysText} ${hoursText} ${minutesText} ago`.trim();
};

// Click outside to close
const handleClickOutside = (event: MouseEvent) => {
  const target = event.target as Element;
  if (!target.closest('.relative')) {
    isOpen.value = false;
  }
};

onMounted(() => {
  document.addEventListener('click', handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
});
</script>
