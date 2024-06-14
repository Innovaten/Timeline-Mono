import lodash, { TemplateExecutor } from 'lodash';

export const smsBodyTemplates: Record<string, TemplateExecutor> = {
    registration: lodash.template('Your registration application has been submitted, ${firstName}. Enter the OTP %otp_code% to complete registration.')
}
