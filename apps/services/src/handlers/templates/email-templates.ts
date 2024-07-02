import lodash, { TemplateExecutor } from 'lodash';

export const emailSubjectTemplates: Record<string, TemplateExecutor> = {
    registration: lodash.template('Your registration application has been submitted, ${firstName}'),
    "registration-approved": lodash.template("You've been approved ${firstName}!")
}

export const emailBodyTemplates: Record<string, TemplateExecutor> = {
    registration:  lodash.template([
        "Hi ${firstName}!",
        "Your registration application to the Timeline Trust Student Console has been recieved successfully. Your registration ID is ${code}",
        "We'll be in touch with next steps once your application has been reviewed by the administrators.",
        "",
        "Best regards,",
        "Timeline Trust"]
        .join("<br>")
        // Data:
        // firstName
        // code
        // email
    ),
    "registration-approved": lodash.template([
        "Hi ${firstName}!",
        "Your registration application to the Timeline Trust Student Console has been approved!",
        "Please <a href='${link}' target='_blank'>click here</a> to accept your admission",
        "",
        "Registration ID: ${code}",
        "",
        "Best regards,",
        "Timeline Trust"]
        .join("<br>")
        // Data:
        // firstName
        // code
        // email
        // link
    ),
}




