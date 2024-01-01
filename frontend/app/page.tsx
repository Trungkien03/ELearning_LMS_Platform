'use client';
import Header from '@app/components/header/Header';
import Hero from '@app/components/header/Hero';
import Heading from '@app/components/layouts/Heading';
import { HEADER } from '@app/constants/Header.constants';
import { FC, useState } from 'react';
import { INIT_VALUE_NUMBER } from '../constants/Common.constants';

interface Props {}

const Page: FC<Props> = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeItem, setActiveItem] = useState(INIT_VALUE_NUMBER);
  return (
    <div>
      <Heading title={HEADER.TITLE} description={HEADER.DESCRIPTION} keywords={HEADER.KEYWORDS} />
      <Header isOpen={isOpen} setIsOpen={setIsOpen} activeItem={activeItem} />
      <Hero />
    </div>
  );
};

export default Page;
