import { SIZE_ICONS } from '@app/constants/Common.constants';
import { ROUTES } from '@app/constants/Header.constants';
import { setIsOpen, setIsOpenSidebar } from '@app/redux/features/headerSlice';
import { useAppDispatch, useAppSelector } from '@app/redux/hooks';
import Link from 'next/link';
import { HiOutlineMenuAlt3, HiOutlineUserCircle } from 'react-icons/hi';
import ThemeSwitcher from '../layouts/ThemeSwitcher';
import NavItems from './NavItems';

const ScreenHeader = () => {
  const { activeItem } = useAppSelector((state) => state.header);
  const dispatch = useAppDispatch();
  return (
    <div className='w-[95%] 800px:w-[92%] m-auto py-2 h-full'>
      <div className='w-full h-[80px] flex items-center justify-between p-3'>
        <div>
          <Link href={ROUTES.HOME} className='text-[25px] font-Poppins font-[500] text-black dark:text-white'>
            ELearning
          </Link>
        </div>
        <div className='flex items-center'>
          <NavItems activeItem={activeItem} isMobile={false} />
          <ThemeSwitcher />
          {/* this is only for mobile */}
          <div className='800px:hidden'>
            <HiOutlineMenuAlt3
              className='cursor-pointer dark:text-white text-black'
              size={SIZE_ICONS}
              onClick={() => dispatch(setIsOpenSidebar(true))}
            />
          </div>
          <HiOutlineUserCircle
            className='hidden 800px:block cursor-pointer ml-5 dark:text-white text-black'
            size={SIZE_ICONS}
            onClick={() => dispatch(setIsOpen(true))}
          />
        </div>
      </div>
    </div>
  );
};

export default ScreenHeader;
