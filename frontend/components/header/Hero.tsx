import Image from 'next/image';
import Link from 'next/link';
import Banner from '../../public/assets/banner-img-1.png';
import { FaArrowCircleRight } from 'react-icons/fa';

const Hero = () => {
  return (
    <section className='bg-white dark:bg-gray-900 h-screen'>
      <div className='grid max-w-screen-xl px-4 py-8 mx-auto lg:gap-8 xl:gap-0 lg:py-16 lg:grid-cols-12'>
        <div className='mt-8 lg:mt-0 lg:col-span-5'>
          <Image
            className='object-contain lg:max-w-full h-auto'
            src={Banner}
            alt='banner image'
            width={1500}
            height={1000}
          />
        </div>
        <div className='lg:col-span-7'>
          <h1 className='max-w-2xl mb-4 text-4xl font-extrabold tracking-tight leading-none md:text-5xl xl:text-6xl dark:text-white text-black'>
            Improve Your Online Learning Experience Better Instantly
          </h1>
          <p className='max-w-2xl mb-6 font-light text-gray-500 lg:mb-8 md:text-lg lg:text-xl dark:text-gray-400'>
            We have online courses and Online registered students. Find your desired courses from Here
          </p>
          <div className='flex flex-col lg:flex-row'>
            <Link
              href='#'
              className='mb-3 lg:mr-3 lg:mb-0 inline-flex items-center justify-center px-5 py-3 text-base text-gray-900 font-medium text-center dark:text-white rounded-lg bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 dark:focus:ring-primary-900'
            >
              Get started <FaArrowCircleRight className='ml-5' />
            </Link>
            <Link
              href='#'
              className='inline-flex items-center justify-center px-5 py-3 text-base font-medium text-center text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 dark:text-white dark:border-gray-700 dark:hover:bg-gray-700 dark:focus:ring-gray-800'
            >
              View Courses
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
