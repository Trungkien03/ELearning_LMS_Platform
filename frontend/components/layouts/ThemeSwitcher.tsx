'use client';
import { SCREEN_MODE, SIZE_ICONS } from '@app/constants/Common.constants';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { BiMoon, BiSun } from 'react-icons/bi';

const ThemeSwitcher = () => {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();
  useEffect(() => {
    setMounted(true);
  }, []);
  if (!mounted) {
    return null;
  }
  return (
    <div className='flex items-center justify-center mx-4'>
      {theme === 'light' ? (
        <BiMoon className='cursor-pointer' fill='black' size={SIZE_ICONS} onClick={() => setTheme(SCREEN_MODE.DARK)} />
      ) : (
        <BiSun className='cursor-pointer' fill='white' size={SIZE_ICONS} onClick={() => setTheme(SCREEN_MODE.LIGHT)} />
      )}
    </div>
  );
};

export default ThemeSwitcher;
