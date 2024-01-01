import { initialStateHeader } from '@app/constants/Header.constants';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const headerSlice = createSlice({
  name: 'header',
  initialState: initialStateHeader,
  reducers: {
    setIsActive: (state, action: PayloadAction<boolean>) => {
      state.isActive = action.payload;
    },
    setIsOpenSidebar: (state, action: PayloadAction<boolean>) => {
      state.isOpenSideBar = action.payload;
    },
    setActiveItem: (state, action: PayloadAction<number>) => {
      state.activeItem = action.payload;
    },
    setIsOpen: (state, action: PayloadAction<boolean>) => {
      state.isOpen = action.payload;
    }
  }
});

export const { setIsActive, setIsOpenSidebar, setActiveItem, setIsOpen } = headerSlice.actions;

export default headerSlice.reducer;
