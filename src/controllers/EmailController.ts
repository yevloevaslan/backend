import { badGateway } from 'boom';
import needle from 'needle';
import config from '../config';
import { Environment } from '../constants/environment';
import { DEFAULT_LANGUAGE, emailLocalization, templatedVariables } from '../constants/localization';
const {NODE_ENV} = process.env;
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    host: config.smtp.host,
    port: 587,
    requireTLS: true,
    auth: {
        user: config.smtp.user,
        pass: config.smtp.pass,
    },
});


const sendEmail = async (email: string, subject: string, text: string)=> {
    const result = await needle('post', config.email.url, 
        {email, subject, text }, 
        { headers: {'Content-Type': 'application/json'}});  
    if (result.statusCode !== 200) throw badGateway();
};
const sendConfirmCode = async (email: string, confirmCode: string, language = DEFAULT_LANGUAGE): Promise<boolean> => {
    const emailText = emailLocalization[language].confirmEmail.text.replace(templatedVariables.confirmCode, confirmCode);
    if ((NODE_ENV === Environment.development && !config.email.url) || NODE_ENV === Environment.test) {
        console.log(emailText);
        return true;
    }
    try {
        await smtpSender(email, emailLocalization[language].confirmEmail.subject, emailText);
        return true;
    } catch (e) {
        console.log(e.message);
        return false;
    }
};

const smtpSender = async (email: string, subject: string, text: string) => {
    const result = await transporter.sendMail({
        sender: 'Samott <postmaster@samott.use-case.ru>',
        text,
        subject,
        to: email,
    });
    console.log(result);
};


export {
    sendConfirmCode,
};