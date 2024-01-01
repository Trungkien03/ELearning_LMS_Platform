'use client';
import { HEADER_HEIGHT } from '@app/constants/Common.constants';
import { HeaderProps } from '@app/types/Layout.types';
import Link from 'next/link';
import { FC, useState } from 'react';
import ThemeSwitcher from '../layouts/ThemeSwitcher';
import NavItems from './NavItems';

const Header: FC<HeaderProps> = ({ activeItem }) => {
  const [isActive, setIsActive] = useState(false);
  const [isOpenSideBar, setIsOpenSideBar] = useState(false);

  if (typeof window !== 'undefined') {
    window.addEventListener('scroll', () => {
      if (window.screenY > HEADER_HEIGHT) {
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
        <div className='w-[95%] 800px:w-[92%] m-auto py-2 h-full'>
          <div className='w-full h-[80px] flex items-center justify-between p-3'>
            <div>
              <Link href={'/'} className='text-[25px] font-Poppins font-[500] text-black dark:text-white'>
                ELearning
              </Link>
            </div>
            <div className='flex items-center'>
              <NavItems activeItem={activeItem} isMobile={false} />
              <ThemeSwitcher />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
