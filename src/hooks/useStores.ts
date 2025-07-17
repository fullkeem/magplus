import { useFiltersStore } from "@/stores/filters";
import { useUIStore } from "@/stores/ui";

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
    isShareModalOpen,
    isMenuOpen,
    isPageLoading,
    isArticleLoading,
    theme,
    sidebarCollapsed,
    toasts,
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
    isShareModalOpen,
    isMenuOpen,
    isPageLoading,
    isArticleLoading,
    theme,
    sidebarCollapsed,
    toasts,
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

// 특정 기능을 위한 조합 훅들

export const useToasts = () => {
  const { toasts, removeToast } = useUIStore();

  return {
    toasts,
    removeToast,
  };
};
