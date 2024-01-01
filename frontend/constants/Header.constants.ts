import { HeaderState, navItemType } from '@app/types/Layout.types';

export enum HEADER {
  TITLE = 'ELearning',
  DESCRIPTION = 'ELearning is a platform for students to learn and get help from teachers',
  KEYWORDS = 'Programming, Redux, Machine Learning'
}

export const initialStateHeader: HeaderState = {
  isOpen: false,
  activeItem: 0,
  isActive: false,
  isOpenSideBar: false
};

export const ROUTES = {
  HOME: '/',
  COURSES: '/courses',
  ABOUT: '/about',
  POLICY: '/policy',
  FAQ: '/faq'
};

export const navItemData: navItemType[] = [
  { name: 'Home', url: ROUTES.HOME },
  { name: 'Courses', url: ROUTES.COURSES },
  { name: 'About', url: ROUTES.ABOUT },
  { name: 'Policy', url: ROUTES.POLICY },
  { name: 'FAQ', url: ROUTES.FAQ }
];
