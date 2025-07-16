import { useFiltersStore } from "@/stores/filters";
import { useUIStore } from "@/stores/ui";
import { useSubscriptionStore } from "@/stores/subscription";

// 기본 스토어 훅들
export const useFilters = () => {
  const {
    selectedCategory,
    selectedRegion,
    selectedTags,
    sortBy,
    searchQuery,
    setCategory,
    setRegion,
    toggleTag,
    clearTags,
    setSortBy,
    setSearchQuery,
    clearFilters,
    resetFilters,
  } = useFiltersStore();

  return {
    selectedCategory,
    selectedRegion,
    selectedTags,
    sortBy,
    searchQuery,
    setCategory,
    setRegion,
    toggleTag,
    clearTags,
    setSortBy,
    setSearchQuery,
    clearFilters,
    resetFilters,
  };
};

export const useUI = () => {
  const {
    isSubscribeModalOpen,
    isShareModalOpen,
    isMenuOpen,
    isPageLoading,
    isArticleLoading,
    theme,
    sidebarCollapsed,
    toasts,
    openSubscribeModal,
    closeSubscribeModal,
    openShareModal,
    closeShareModal,
    toggleMenu,
    closeMenu,
    setPageLoading,
    setArticleLoading,
    setTheme,
    toggleSidebar,
    setSidebarCollapsed,
    addToast,
    removeToast,
    clearToasts,
    showSuccess,
    showError,
    showInfo,
  } = useUIStore();

  return {
    isSubscribeModalOpen,
    isShareModalOpen,
    isMenuOpen,
    isPageLoading,
    isArticleLoading,
    theme,
    sidebarCollapsed,
    toasts,
    openSubscribeModal,
    closeSubscribeModal,
    openShareModal,
    closeShareModal,
    toggleMenu,
    closeMenu,
    setPageLoading,
    setArticleLoading,
    setTheme,
    toggleSidebar,
    setSidebarCollapsed,
    addToast,
    removeToast,
    clearToasts,
    showSuccess,
    showError,
    showInfo,
  };
};

export const useSubscription = () => {
  const {
    isSubscribed,
    email,
    preferences,
    readArticles,
    subscribe,
    unsubscribe,
    updatePreferences,
    markAsRead,
    markAsUnread,
    clearReadingHistory,
  } = useSubscriptionStore();

  return {
    isSubscribed,
    email,
    preferences,
    readArticles,
    subscribe,
    unsubscribe,
    updatePreferences,
    markAsRead,
    markAsUnread,
    clearReadingHistory,
  };
};

// 특정 기능을 위한 조합 훅들

export const useReadingHistory = () => {
  const { readArticles, markAsRead, clearReadingHistory } =
    useSubscriptionStore();

  const isRead = (articleId: string) => readArticles.includes(articleId);

  return {
    readArticles,
    isRead,
    markAsRead,
    clearReadingHistory,
  };
};

export const useToasts = () => {
  const { toasts, removeToast } = useUIStore();

  return {
    toasts,
    removeToast,
  };
};
