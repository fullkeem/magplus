import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface SubscriptionState {
  // 이메일 기반 구독 (인증 없음)
  isSubscribed: boolean;
  email: string | null;
  preferences: {
    emailNotifications: boolean;
    categoryNotifications: string[]; // CategoryId 대신 string 사용
    frequency: "daily" | "weekly" | "monthly";
  };

  // 로컬 스토리지 기반 기능들
  bookmarkedArticles: string[];
  readArticles: string[];
}

export interface SubscriptionActions {
  // 구독 관리
  subscribe: (email: string) => void;
  unsubscribe: () => void;
  updatePreferences: (
    preferences: Partial<SubscriptionState["preferences"]>
  ) => void;

  // 북마크 관리
  addBookmark: (articleId: string) => void;
  removeBookmark: (articleId: string) => void;
  clearBookmarks: () => void;

  // 읽기 기록 관리
  markAsRead: (articleId: string) => void;
  markAsUnread: (articleId: string) => void;
  clearReadingHistory: () => void;
}

type SubscriptionStore = SubscriptionState & SubscriptionActions;

export const useSubscriptionStore = create<SubscriptionStore>()(
  persist(
    (set) => ({
      // State
      isSubscribed: false,
      email: null,
      preferences: {
        emailNotifications: true,
        categoryNotifications: [],
        frequency: "weekly",
      },
      bookmarkedArticles: [],
      readArticles: [],

      // Actions
      subscribe: (email) =>
        set({
          isSubscribed: true,
          email,
        }),

      unsubscribe: () =>
        set({
          isSubscribed: false,
          email: null,
        }),

      updatePreferences: (newPreferences) =>
        set((state) => ({
          preferences: {
            ...state.preferences,
            ...newPreferences,
          },
        })),

      addBookmark: (articleId) =>
        set((state) => ({
          bookmarkedArticles: state.bookmarkedArticles.includes(articleId)
            ? state.bookmarkedArticles
            : [...state.bookmarkedArticles, articleId],
        })),

      removeBookmark: (articleId) =>
        set((state) => ({
          bookmarkedArticles: state.bookmarkedArticles.filter(
            (id) => id !== articleId
          ),
        })),

      clearBookmarks: () => set({ bookmarkedArticles: [] }),

      markAsRead: (articleId) =>
        set((state) => ({
          readArticles: state.readArticles.includes(articleId)
            ? state.readArticles
            : [...state.readArticles, articleId],
        })),

      markAsUnread: (articleId) =>
        set((state) => ({
          readArticles: state.readArticles.filter((id) => id !== articleId),
        })),

      clearReadingHistory: () => set({ readArticles: [] }),
    }),
    {
      name: "subscription-storage",
      partialize: (state) => ({
        isSubscribed: state.isSubscribed,
        email: state.email,
        preferences: state.preferences,
        bookmarkedArticles: state.bookmarkedArticles,
        readArticles: state.readArticles,
      }),
    }
  )
);
