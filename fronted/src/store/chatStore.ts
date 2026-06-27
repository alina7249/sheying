import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  isFavorite?: boolean;
  tags?: string[];
  status?: 'sending' | 'sent' | 'failed';
}

export interface ChatHistory {
  id: string;
  title: string;
  messages: Message[];
  lastActive: Date;
  contextId?: string;
  isPinned?: boolean;
}

export interface AIRole {
  id: string;
  name: string;
  description: string;
  avatar: string;
  systemPrompt: string;
  features?: string[];
}

const defaultRoles: AIRole[] = [
  {
    id: 'photography-expert',
    name: '摄影专家',
    description: '回答摄影相关问题，提供技术指导和创作建议',
    avatar: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=professional%20photographer%20expert%20avatar&sign=2addbb5e55df86ecf697bd2f3033610e',
    systemPrompt: '你是一位专业的摄影专家，擅长回答各类摄影技术问题和提供创作建议。',
    features: ['技术指导', '创作建议', '构图分析']
  },
  {
    id: 'equipment-advisor',
    name: '器材顾问',
    description: '提供相机、镜头等摄影器材的选购建议和使用技巧',
    avatar: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=camera%20equipment%20expert%20avatar&sign=3abbbf69544ac5f9e29cb01e70db188a',
    systemPrompt: '你是一位摄影器材专家，能够提供相机、镜头等设备的专业建议。',
    features: ['器材推荐', '参数解读', '使用技巧']
  },
  {
    id: 'copywriter',
    name: '文案专家',
    description: '为摄影作品创作吸引人的标题和描述文案',
    avatar: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=creative%20copywriter%20avatar&sign=c0f4d939b99d49b1f7cd1ffbb25aac1a',
    systemPrompt: '你是一位创意文案专家，擅长为摄影作品创作吸引人的标题和描述。',
    features: ['标题创作', '描述优化', '文案润色']
  },
  {
    id: 'photo-editor',
    name: '后期编辑',
    description: '提供照片后期处理的建议和技巧',
    avatar: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=photo%20editor%20expert%20avatar&sign=0ff6f3811e5710b9a00bca31003b8f35',
    systemPrompt: '你是一位专业的照片后期编辑，能够提供Photoshop、Lightroom等软件的使用技巧和后期处理建议。',
    features: ['修图技巧', '调色建议', '后期流程']
  }
];

export const useChatStore = defineStore('chat', () => {
  const currentChatId = ref<string | null>(null);
  const currentContextId = ref<string | null>(null);
  const chatHistories = ref<ChatHistory[]>([]);
  const isHistoryPanelOpen = ref(false);
  const isFileUploading = ref(false);
  const uploadingProgress = ref(0);
  const isTyping = ref(false);
  const availableRoles = ref<AIRole[]>(defaultRoles);
  const selectedRole = ref<AIRole | null>(defaultRoles[0]);

  const createNewChat = (title = '新对话'): ChatHistory => {
    const newChat: ChatHistory = {
      id: `chat-${Date.now()}`,
      title,
      messages: [],
      lastActive: new Date()
    };

    chatHistories.value = [newChat, ...chatHistories.value];
    currentChatId.value = newChat.id;

    return newChat;
  };

  const setCurrentChat = (chatId: string) => {
    const chat = chatHistories.value.find(c => c.id === chatId);
    if (chat) {
      currentChatId.value = chatId;
      currentContextId.value = chat.contextId || null;
      isTyping.value = false;
    }
  };

  const addMessage = (chatId: string, message: Omit<Message, 'id' | 'timestamp'>): Message => {
    const newMessage: Message = {
      ...message,
      id: `msg-${Date.now()}`,
      timestamp: new Date(),
      status: 'sent'
    };

    chatHistories.value = chatHistories.value.map(chat => {
      if (chat.id === chatId) {
        return {
          ...chat,
          messages: [...chat.messages, newMessage],
          lastActive: new Date()
        };
      }
      return chat;
    });

    return newMessage;
  };

  const updateMessage = (chatId: string, messageId: string, updates: Partial<Message>) => {
    chatHistories.value = chatHistories.value.map(chat => {
      if (chat.id === chatId) {
        return {
          ...chat,
          messages: chat.messages.map(msg =>
            msg.id === messageId ? { ...msg, ...updates } : msg
          )
        };
      }
      return chat;
    });
  };

  const deleteChat = (chatId: string) => {
    chatHistories.value = chatHistories.value.filter(chat => chat.id !== chatId);
    if (currentChatId.value === chatId) {
      currentChatId.value = null;
    }
  };

  const clearCurrentChat = () => {
    if (currentChatId.value) {
      chatHistories.value = chatHistories.value.map(chat => {
        if (chat.id === currentChatId.value) {
          return {
            ...chat,
            messages: [],
            contextId: undefined
          };
        }
        return chat;
      });
    }
  };

  const toggleHistoryPanel = () => {
    isHistoryPanelOpen.value = !isHistoryPanelOpen.value;
  };

  const setFileUploadProgress = (progress: number) => {
    uploadingProgress.value = progress;
  };

  const setIsFileUploading = (uploading: boolean) => {
    isFileUploading.value = uploading;
  };

  const setIsTyping = (typing: boolean) => {
    isTyping.value = typing;
  };

  const setSelectedRole = (role: AIRole) => {
    selectedRole.value = role;
  };

  const updateChatTitle = (chatId: string, title: string) => {
    chatHistories.value = chatHistories.value.map(chat => {
      if (chat.id === chatId) {
        return { ...chat, title };
      }
      return chat;
    });
  };

  const toggleMessageFavorite = (chatId: string, messageId: string) => {
    chatHistories.value = chatHistories.value.map(chat => {
      if (chat.id === chatId) {
        return {
          ...chat,
          messages: chat.messages.map(msg =>
            msg.id === messageId
              ? { ...msg, isFavorite: !msg.isFavorite }
              : msg
          )
        };
      }
      return chat;
    });
  };

  const addMessageTag = (chatId: string, messageId: string, tag: string) => {
    chatHistories.value = chatHistories.value.map(chat => {
      if (chat.id === chatId) {
        return {
          ...chat,
          messages: chat.messages.map(msg => {
            if (msg.id === messageId) {
              const existingTags = msg.tags || [];
              if (!existingTags.includes(tag)) {
                return { ...msg, tags: [...existingTags, tag] };
              }
            }
            return msg;
          })
        };
      }
      return chat;
    });
  };

  const setContextId = (contextId: string | null) => {
    currentContextId.value = contextId;
    if (currentChatId.value) {
      chatHistories.value = chatHistories.value.map(chat => {
        if (chat.id === currentChatId.value) {
          return { ...chat, contextId: contextId || undefined };
        }
        return chat;
      });
    }
  };

  const toggleChatPin = (chatId: string) => {
    const updatedChats = chatHistories.value.map(chat => {
      if (chat.id === chatId) {
        return { ...chat, isPinned: !chat.isPinned };
      }
      return chat;
    });

    const pinnedChats = updatedChats.filter(chat => chat.isPinned);
    const unpinnedChats = updatedChats.filter(chat => !chat.isPinned);

    chatHistories.value = [...pinnedChats, ...unpinnedChats];
  };

  const exportChat = (chatId: string) => {
    const chat = chatHistories.value.find(c => c.id === chatId);
    if (chat) {
      console.log('Exporting chat:', chat);
    }
  };

  return {
    currentChatId,
    currentContextId,
    chatHistories,
    isHistoryPanelOpen,
    isFileUploading,
    uploadingProgress,
    isTyping,
    availableRoles,
    selectedRole,
    createNewChat,
    setCurrentChat,
    addMessage,
    updateMessage,
    deleteChat,
    clearCurrentChat,
    toggleHistoryPanel,
    setFileUploadProgress,
    setIsFileUploading,
    setIsTyping,
    setSelectedRole,
    updateChatTitle,
    toggleMessageFavorite,
    addMessageTag,
    setContextId,
    toggleChatPin,
    exportChat
  };
});