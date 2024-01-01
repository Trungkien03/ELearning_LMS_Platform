import React, { FC } from 'react';
import { HiOutlineUserCircle } from 'react-icons/hi';
import NavItems from './NavItems';
import { SIZE_ICONS } from '@app/constants/Common.constants';

type MobileSideBarProps = {
  isOpenSideBar: boolean;
  handleClose: (e: React.MouseEvent<HTMLDivElement, globalThis.MouseEvent>) => void;
  activeItem: number;
  setIsOpen: (open: boolean) => void;
};

const MobileSideBar: FC<MobileSideBarProps> = ({ isOpenSideBar, activeItem, handleClose, setIsOpen }) => {
  return (
    <>
      {/* MobileSideBar */}
      {isOpenSideBar && (
        <div
          className='fixed w-full h-screen top-0 left-0 z-[99999] dark:bg-[unset] bg-[#00000024]'
          onClick={handleClose}
          id='screen'
        >
          <div className='w-[70%] fixed z-[999999999] h-screen bg-white dark:bg-slate-900 dark:bg-opacity-90 top-0 right-0'>
            <NavItems activeItem={activeItem} isMobile={true} />
            <HiOutlineUserCircle
              className='cursor-pointer ml-5 mt-5 dark:text-white text-black'
              size={SIZE_ICONS}
              onClick={() => setIsOpen(true)}
            />
            <br />
            <br />
            <p className='text-[16px] text-black dark:text-white pl-5 px-2'>Copyright &copy; 2024 ELearning</p>
          </div>
        </div>
      )}
    </>
  );
};

export default MobileSideBar;
