import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CategoryFilter } from "@/constants/categories";
import type { RegionId, RegionFilter } from "@/constants/regions";

export interface FiltersState {
  selectedCategory: CategoryFilter | null;
  selectedRegion: RegionFilter | null;
  selectedTags: string[];
  sortBy: "latest" | "popular" | "oldest";
  searchQuery: string;
}

export interface FiltersActions {
  setCategory: (category: CategoryFilter | null) => void;
  setRegion: (region: RegionFilter | null) => void;
  toggleTag: (tag: string) => void;
  clearTags: () => void;
  setSortBy: (sortBy: FiltersState["sortBy"]) => void;
  setSearchQuery: (query: string) => void;
  clearFilters: () => void;
  resetFilters: () => void;
}

type FiltersStore = FiltersState & FiltersActions;

const initialState: FiltersState = {
  selectedCategory: null,
  selectedRegion: null,
  selectedTags: [],
  sortBy: "latest",
  searchQuery: "",
};

export const useFiltersStore = create<FiltersStore>()(
  persist(
    (set, get) => ({
      // State
      ...initialState,

      // Actions
      setCategory: (selectedCategory) => set({ selectedCategory }),

      setRegion: (selectedRegion) => set({ selectedRegion }),

      toggleTag: (tag) => {
        const { selectedTags } = get();
        const isSelected = selectedTags.includes(tag);

        set({
          selectedTags: isSelected
            ? selectedTags.filter((t) => t !== tag)
            : [...selectedTags, tag],
        });
      },

      clearTags: () => set({ selectedTags: [] }),

      setSortBy: (sortBy) => set({ sortBy }),

      setSearchQuery: (searchQuery) => set({ searchQuery }),

      clearFilters: () =>
        set({
          selectedCategory: null,
          selectedRegion: null,
          selectedTags: [],
          searchQuery: "",
        }),

      resetFilters: () => set(initialState),
    }),
    {
      name: "filters-storage",
      partialize: (state) => ({
        selectedCategory: state.selectedCategory,
        selectedRegion: state.selectedRegion,
        selectedTags: state.selectedTags,
        sortBy: state.sortBy,
      }),
    }
  )
);
