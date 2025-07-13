import { useFiltersStore, useUIStore, useSubscriptionStore } from "@/stores";

// 자주 사용되는 상태들을 조합한 커스텀 훅들

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
    showWarning,
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
    showWarning,
  };
};

export const useSubscription = () => {
  const {
    isSubscribed,
    email,
    preferences,
    bookmarkedArticles,
    readArticles,
    subscribe,
    unsubscribe,
    updatePreferences,
    addBookmark,
    removeBookmark,
    clearBookmarks,
    markAsRead,
    markAsUnread,
    clearReadingHistory,
  } = useSubscriptionStore();

  return {
    isSubscribed,
    email,
    preferences,
    bookmarkedArticles,
    readArticles,
    subscribe,
    unsubscribe,
    updatePreferences,
    addBookmark,
    removeBookmark,
    clearBookmarks,
    markAsRead,
    markAsUnread,
    clearReadingHistory,
  };
};

// 특정 기능을 위한 조합 훅들

export const useBookmarks = () => {
  const { bookmarkedArticles, addBookmark, removeBookmark, clearBookmarks } =
    useSubscriptionStore();

  const isBookmarked = (articleId: string) =>
    bookmarkedArticles.includes(articleId);

  const toggleBookmark = (articleId: string) => {
    if (isBookmarked(articleId)) {
      removeBookmark(articleId);
    } else {
      addBookmark(articleId);
    }
  };

  return {
    bookmarkedArticles,
    isBookmarked,
    toggleBookmark,
    clearBookmarks,
  };
};

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
  const { toasts, addToast, removeToast, clearToasts } = useUIStore();

  const showSuccess = (message: string, duration?: number) => {
    addToast({ type: "success", message, duration });
  };

  const showError = (message: string, duration?: number) => {
    addToast({ type: "error", message, duration });
  };

  const showInfo = (message: string, duration?: number) => {
    addToast({ type: "info", message, duration });
  };

  const showWarning = (message: string, duration?: number) => {
    addToast({ type: "warning", message, duration });
  };

  return {
    toasts,
    showSuccess,
    showError,
    showInfo,
    showWarning,
    removeToast,
    clearToasts,
  };
};
