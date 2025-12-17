import type {} from '@redux-devtools/extension';
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

type PhotoState = {
  file: File | null;
};

type PhotoActions = {
  setFile: (file: File) => void;
  clear: () => void;
};

type PhotoStore = PhotoState & PhotoActions;

const initialState: PhotoState = {
  file: null
};

export const usePhotoStore = create<PhotoStore>()(
  devtools(
    (set) => ({
      ...initialState,
      setFile: (file) => set({ file }),
      clear: () => set(initialState)
    }),
    {
      name: 'photo-store'
    }
  )
);

export const selectPhotoFile = (state: PhotoStore) => state.file;
