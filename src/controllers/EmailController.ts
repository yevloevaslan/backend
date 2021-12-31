import { badGateway } from 'boom';
import needle from 'needle';
import config from '../config';
import { Environment } from '../constants/environment';
import { DEFAULT_LANGUAGE, emailLocalization, templatedVariables } from '../constants/localization';
const {NODE_ENV} = process.env;
import nodemailer from 'nodemailer';
import randomIntFromInterval from '../libs/randomIntFromInterval';

const transporter1 = nodemailer.createTransport({
    host: config.smtp1.host,
    port: 587,
    requireTLS: true,
    auth: {
        user: config.smtp1.user,
        pass: config.smtp1.pass,
    },
});
const transporter2 = nodemailer.createTransport({
    host: config.smtp2.host,
    port: 587,
    requireTLS: true,
    auth: {
        user: config.smtp2.user,
        pass: config.smtp2.pass,
    },
});
const transporter3 = nodemailer.createTransport({
    host: config.smtp3.host,
    port: 587,
    requireTLS: true,
    auth: {
        user: config.smtp3.user,
        pass: config.smtp3.pass,
    },
});
const transporters = [transporter1, transporter2, transporter3];

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
    const randomInt = randomIntFromInterval(0, transporters.length-1);
    const mailObj = {
        sender: config[`smtp${randomInt+1}`].sender,
        text,
        subject,
        to: email,
    };
    const transporter = transporters[ randomInt ];
    console.log(randomInt, mailObj);

    const result = await transporter.sendMail(mailObj);
    console.log(`sent with transporter${randomInt+1}`, result);
};

export {
    sendConfirmCode,
};