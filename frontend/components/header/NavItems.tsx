import { navItemData } from '@app/constants/Header.constants';
import { NavItemsProps } from '@app/types/Layout.types';
import Link from 'next/link';
import { FC } from 'react';

const NavItems: FC<NavItemsProps> = ({ activeItem, isMobile }) => {
  return (
    <>
      {isMobile ? (
        <div className='800px:hidden mt-5 '>
          <div className='w-full text-center py-6'>
            <Link href={'/'} className='text-[25px] font-Poppins font-[500] text-black dark:text-white'>
              ELearning
            </Link>
          </div>
          {navItemData &&
            navItemData.map((item, index) => (
              <Link href={item.url} key={index} passHref>
                <span
                  className={`${
                    activeItem === index ? 'dark:text-[#37a39a] text-[crimson]' : 'dark:text-white text-black'
                  } block py-5 text-[18px] px-6 font-Poppins font-[400]`}
                >
                  {item.name}
                </span>
              </Link>
            ))}
        </div>
      ) : (
        <div className='hidden 800px:flex'>
          {navItemData &&
            navItemData.map((item, index) => (
              <Link href={item.url} key={index} passHref>
                <span
                  className={`${
                    activeItem === index ? 'dark:text-[#37a39a] text-[crimson]' : 'dark:text-white text-black'
                  } text-[18px] px-6 font-Poppins font-[400]`}
                >
                  {item.name}
                </span>
              </Link>
            ))}
        </div>
      )}
    </>
  );
};

export default NavItems;
