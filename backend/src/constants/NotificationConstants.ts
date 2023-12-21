export const NOTIFICATION_STATUS = ['unread', 'read'];

export enum STATUS {
  UNREAD = 'unread',
  READ = 'read'
}

export enum NOTIFICATION_ROUTES {
  GET_ALL = '/get-all-notifications',
  UPDATE = '/update-notification/:id'
}
