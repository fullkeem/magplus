import { create } from "zustand";

export interface UIState {
  // Modal states
  isShareModalOpen: boolean;
  isMenuOpen: boolean;

  // Loading states
  isPageLoading: boolean;
  isArticleLoading: boolean;

  // Theme
  theme: "light" | "dark" | "system";

  // Layout
  sidebarCollapsed: boolean;

  // Toast notifications
  toasts: Array<{
    id: string;
    type: "success" | "error" | "info" | "warning";
    message: string;
    duration?: number;
  }>;
}

export interface UIActions {
  // Modal actions
  openShareModal: () => void;
  closeShareModal: () => void;
  toggleMenu: () => void;
  closeMenu: () => void;

  // Loading actions
  setPageLoading: (loading: boolean) => void;
  setArticleLoading: (loading: boolean) => void;

  // Theme actions
  setTheme: (theme: UIState["theme"]) => void;

  // Layout actions
  toggleSidebar: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;

  // Toast actions
  addToast: (toast: Omit<UIState["toasts"][0], "id">) => void;
  removeToast: (id: string) => void;
  clearToasts: () => void;

  // Convenience toast methods
  showSuccess: (message: string, duration?: number) => void;
  showError: (message: string, duration?: number) => void;
  showInfo: (message: string, duration?: number) => void;
  showWarning: (message: string, duration?: number) => void;
}

type UIStore = UIState & UIActions;

export const useUIStore = create<UIStore>((set, get) => ({
  // State
  isShareModalOpen: false,
  isMenuOpen: false,
  isPageLoading: false,
  isArticleLoading: false,
  theme: "system",
  sidebarCollapsed: false,
  toasts: [],

  // Modal actions
  openShareModal: () => set({ isShareModalOpen: true }),

  closeShareModal: () => set({ isShareModalOpen: false }),

  toggleMenu: () => set((state) => ({ isMenuOpen: !state.isMenuOpen })),

  closeMenu: () => set({ isMenuOpen: false }),

  // Loading actions
  setPageLoading: (isPageLoading) => set({ isPageLoading }),

  setArticleLoading: (isArticleLoading) => set({ isArticleLoading }),

  // Theme actions
  setTheme: (theme) => set({ theme }),

  // Layout actions
  toggleSidebar: () =>
    set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),

  setSidebarCollapsed: (sidebarCollapsed) => set({ sidebarCollapsed }),

  // Toast actions
  addToast: (toast) => {
    const id = Date.now().toString();
    const newToast = { ...toast, id };

    set((state) => ({
      toasts: [...state.toasts, newToast],
    }));

    // Auto remove toast after duration
    if (toast.duration !== 0) {
      setTimeout(() => {
        get().removeToast(id);
      }, toast.duration || 5000);
    }
  },

  removeToast: (id) =>
    set((state) => ({
      toasts: state.toasts.filter((toast) => toast.id !== id),
    })),

  clearToasts: () => set({ toasts: [] }),

  // Convenience toast methods
  showSuccess: (message, duration) =>
    get().addToast({ type: "success", message, duration }),
  showError: (message, duration) =>
    get().addToast({ type: "error", message, duration }),
  showInfo: (message, duration) =>
    get().addToast({ type: "info", message, duration }),
  showWarning: (message, duration) =>
    get().addToast({ type: "warning", message, duration }),
}));
