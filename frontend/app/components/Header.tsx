'use client';
import React, { FC, useState } from 'react';
import { HeaderProps } from '../types/Layout.types';

const Header: FC<HeaderProps> = (props) => {
  const [isActive, setIsActive] = useState(false);
  const [isOpenSideBar, setIsOpenSideBar] = useState(false);

  if (typeof window !== 'undefined') {
    window.addEventListener('scroll', () => {
      if (window.screenY > 80) {
        setIsActive(true);
      } else {
        setIsActive(false);
      }
    });
  }

  return (
    <div className='w-full relative'>
      <div
        className={`${
          isActive
            ? 'dark: bg-opacity-50 dark:bg-gradient-to-b dark:from-gray-900 dark:to-black fixed top-0 left-0 w-full h-[80px] z-[80] dark:border-[#ffffff1c] shadow-xl transition duration-500'
            : 'w-full border-b dark:border-[#ffffff1c] h-[80px] z-[80] dark:shadow'
        }`}
      >
        Header
      </div>
    </div>
  );
};

export default Header;
