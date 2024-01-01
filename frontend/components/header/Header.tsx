// Header.tsx

import { HEADER_HEIGHT } from '@app/constants/Common.constants';
import { setIsActive, setIsOpenSidebar } from '@app/redux/features/headerSlice';
import { useAppDispatch, useAppSelector } from '@app/redux/hooks';
import React from 'react';
import MobileSideBar from './MobileSideBar';
import ScreenHeader from './ScreenHeader';

const Header: React.FC = () => {
  const { isActive } = useAppSelector((state) => state.header);
  const dispatch = useAppDispatch();

  React.useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > HEADER_HEIGHT) {
        dispatch(setIsActive(true));
      } else {
        dispatch(setIsActive(false));
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [dispatch]);

  const handleClose = (e: React.MouseEvent<HTMLDivElement, globalThis.MouseEvent>) => {
    const target = e.target as HTMLDivElement;
    if (target.id === 'screen') {
      dispatch(setIsOpenSidebar(false));
    }
  };

  return (
    <div className='w-full relative'>
      <div
        className={`${
          isActive
            ? 'dark:bg-opacity-50 dark:bg-gradient-to-b dark:from-gray-900 dark:to-black fixed top-0 left-0 w-full h-[80px] z-[80] dark:border-[#ffffff1c] shadow-xl transition duration-500'
            : 'w-full border-b dark:border-[#ffffff1c] h-[80px] z-[80] dark:shadow'
        }`}
      >
        <ScreenHeader />
        <MobileSideBar handleClose={handleClose} />
      </div>
    </div>
  );
};

export default Header;
