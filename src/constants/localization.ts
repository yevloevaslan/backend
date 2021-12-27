export const languages = {
    RUS: 'russian',
};

export const DEFAULT_LANGUAGE = languages.RUS;

export const templatedVariables = {
    confirmCode: '{{confirmCode}}',
};

export const emailLocalization = {
    [languages.RUS]: {
        confirmEmail: {
            text: `
Ваш код подтверждения: ${templatedVariables.confirmCode}

SaMott
            `,
            subject: 'SaMott',
        }, 
        
    },
};