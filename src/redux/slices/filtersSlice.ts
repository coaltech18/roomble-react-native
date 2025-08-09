import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type FilterCriteria = {
  budgetRange: [number, number];
  preferredAreas: string[];
  metroLines: string[];
  vegetarianPreference?: boolean;
  pets?: boolean;
  smoking?: boolean;
  nightOwl?: boolean;
  ageRange: [number, number];
  genderPreference?: string;
  occupation?: string;
  verified?: boolean;
  workFromHome?: boolean;
  startupCollaboration?: boolean;
  familyVisitAccommodation?: boolean;
};

export type FiltersState = FilterCriteria & {
  appliedFilters?: FilterCriteria;
  isApplied?: boolean;
};

const initialState: FiltersState = {
  budgetRange: [10000, 50000],
  preferredAreas: [],
  metroLines: [],
  vegetarianPreference: undefined,
  pets: undefined,
  smoking: undefined,
  nightOwl: undefined,
  ageRange: [20, 35],
  genderPreference: undefined,
  occupation: undefined,
  verified: undefined,
  workFromHome: undefined,
  startupCollaboration: undefined,
  familyVisitAccommodation: undefined,
  appliedFilters: undefined,
  isApplied: false,
};

const filtersSlice = createSlice({
  name: 'filters',
  initialState,
  reducers: {
    setBudgetRange: (s, a: PayloadAction<[number, number]>) => {
      s.budgetRange = a.payload;
    },
    toggleArea: (s, a: PayloadAction<string>) => {
      const idx = s.preferredAreas.indexOf(a.payload);
      if (idx >= 0) s.preferredAreas.splice(idx, 1);
      else s.preferredAreas.push(a.payload);
    },
    toggleMetroLine: (s, a: PayloadAction<string>) => {
      const idx = s.metroLines.indexOf(a.payload);
      if (idx >= 0) s.metroLines.splice(idx, 1);
      else s.metroLines.push(a.payload);
    },
    setVegetarianPreference: (s, a: PayloadAction<boolean | undefined>) => {
      s.vegetarianPreference = a.payload;
    },
    setFlag: (
      s,
      a: PayloadAction<{ key: 'pets' | 'smoking' | 'nightOwl' | 'verified' | 'workFromHome' | 'startupCollaboration' | 'familyVisitAccommodation'; value: boolean | undefined }>
    ) => {
      (s as any)[a.payload.key] = a.payload.value;
    },
    setAgeRange: (s, a: PayloadAction<[number, number]>) => {
      s.ageRange = a.payload;
    },
    setGenderPreference: (s, a: PayloadAction<string | undefined>) => {
      s.genderPreference = a.payload;
    },
    setOccupation: (s, a: PayloadAction<string | undefined>) => {
      s.occupation = a.payload;
    },
    resetFilters: (state) => {
      return { ...initialState };
    },
    applyFilters: (state) => {
      const { appliedFilters, isApplied, ...currentFilters } = state;
      state.appliedFilters = { ...currentFilters };
      state.isApplied = true;
    }
  }
});

export const {
  setBudgetRange,
  toggleArea,
  toggleMetroLine,
  setVegetarianPreference,
  setFlag,
  setAgeRange,
  setGenderPreference,
  setOccupation,
  resetFilters,
  applyFilters
} = filtersSlice.actions;
export default filtersSlice.reducer;


