export type HeaderProps = {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  activeItem: number;
};
export type NavItemsProps = {
  activeItem: number;
  isMobile: boolean;
};

export type navItemType = { name: string; url: string };
