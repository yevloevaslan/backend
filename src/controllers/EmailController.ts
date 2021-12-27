import { badGateway } from 'boom';
import needle from 'needle';
import config from '../config';
import { Environment } from '../constants/environment';
import { DEFAULT_LANGUAGE, emailLocalization, templatedVariables } from '../constants/localization';
const {NODE_ENV} = process.env;


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
        await sendEmail(email, emailLocalization[language].confirmEmail.subject, emailText);
        return true;
    } catch (e) {
        console.log(e.message);
        return false;
    }
};


export {
    sendConfirmCode,
};