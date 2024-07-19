import lodash, { TemplateExecutor } from 'lodash';

// README!!!
// Mnotify may have a character limit of 160 characters.
// If your message exceeds that we'll be sending two SMSs, which costs more money.

export const smsBodyTemplates: Record<string, TemplateExecutor> = {
    registration: lodash.template('Your registration application has been submitted, ${firstName}. Enter the OTP %otp_code% to complete registration.'),
    otp: lodash.template([
        "Good Day! ",
        'Your secret OTP code is ${otp}. ',
        "Do NOT share this code with anyone.",
    ].join("\n"))
}
