'use client';
import Header from '@app/components/header/Header';
import Hero from '@app/components/header/Hero';
import Heading from '@app/components/layouts/Heading';
import { HEADER } from '@app/constants/Header.constants';

const Page = () => {
  return (
    <div>
      <Heading title={HEADER.TITLE} description={HEADER.DESCRIPTION} keywords={HEADER.KEYWORDS} />
      <Header />
      <Hero />
    </div>
  );
};

export default Page;
