export type NavItemsProps = {
  activeItem: number;
  isMobile: boolean;
};

export type HeadingProps = {
  title: string;
  description: string;
  keywords: string;
};

export interface HeaderState {
  isOpen: boolean;
  activeItem: number;
  isActive: boolean;
  isOpenSideBar: boolean;
}

export type MobileSideBarProps = {
  handleClose: (e: React.MouseEvent<HTMLDivElement, globalThis.MouseEvent>) => void;
};

export type navItemType = { name: string; url: string };
