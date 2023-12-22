export const NOTIFICATION_STATUS = ['unread', 'read'];
export const THIRTY_DAY = 30;
export const HOURS_A_DAY = 24;
export const HOURS = 60;
export const MINUTES = 60;
export const NUM_CONVERT_DAY_TIME = 1000;

export enum STATUS {
  UNREAD = 'unread',
  READ = 'read'
}

export enum NOTIFICATION_ROUTES {
  GET_ALL = '/get-all-notifications',
  UPDATE = '/update-notification/:id'
}
