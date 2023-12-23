export interface IEmailOption {
  email: string;
  subject: string;
  template: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: { [key: string]: any };
}
