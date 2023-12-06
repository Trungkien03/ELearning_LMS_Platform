import { IEmailOption } from '@app/types/EmailTypes';
import { IRegistrationBody } from '@app/types/UserTypes';
import dotenv from 'dotenv';
import ejs from 'ejs';
import nodeMailer, { Transporter } from 'nodemailer';
import path from 'path';

dotenv.config();

export const sendActivationEmail = async (user: IRegistrationBody, activationToken: any) => {
  const activationCode = activationToken.activationCode;
  const data = { user: { name: user.name }, activationCode };
  const html = await ejs.renderFile(path.join(__dirname, '../mails/ActivationMail.ejs'), data);

  await sendMail({
    email: user.email,
    subject: 'Activate your account',
    template: 'ActivationMail.ejs',
    data
  });
};

const sendMail = async (option: IEmailOption): Promise<void> => {
  const transporter: Transporter = nodeMailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '567'),
    service: process.env.SMTP_SERVICE,
    auth: {
      user: process.env.SMTP_MAIL,
      pass: process.env.SMTP_PASSWORD
    }
  });

  const { email, subject, template, data } = option;

  // get the path to the email template file
  const templatePath = path.join(__dirname, '../mails', template);

  // render the email template with EJS

  const html: string = await ejs.renderFile(templatePath, data);

  const emailOptions = {
    from: process.env.SMTP_MAIL,
    to: email,
    subject,
    html
  };

  await transporter.sendMail(emailOptions);
};

export default sendMail;
