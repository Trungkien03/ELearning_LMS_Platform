'use client';
import React, { useState, FC } from 'react';
import Heading from '@app/components/layouts/Heading';
import Header from '@app/components/navbar/Header';
import { INIT_VALUE_NUMBER } from '../constants/Common.constants';

interface Props {}

const Page: FC<Props> = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeItem, setActiveItem] = useState(INIT_VALUE_NUMBER);
  return (
    <div>
      <Heading
        title='ELearning'
        description='ELearning is a platform for students to learn and get help from teachers'
        keywords='Programming, Redux, Machine Learning'
      />
      <Header isOpen={isOpen} setIsOpen={setIsOpen} activeItem={activeItem} />
    </div>
  );
};

export default Page;
