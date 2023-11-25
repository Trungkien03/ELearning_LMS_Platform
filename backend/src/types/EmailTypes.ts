export interface IEmailOption {
  email: string;
  subject: string;
  template: string;
  data: { [key: string]: any };
}
