import { navItemType } from '@app/types/Layout.types';

export enum HEADER {
  TITLE = 'ELearning',
  DESCRIPTION = 'ELearning is a platform for students to learn and get help from teachers',
  KEYWORDS = 'Programming, Redux, Machine Learning'
}

export const navItemData: navItemType[] = [
  { name: 'Home', url: '/' },
  { name: 'Courses', url: '/courses' },
  { name: 'About', url: '/about' },
  { name: 'Policy', url: '/policy' },
  { name: 'FAQ', url: '/faq' }
];
