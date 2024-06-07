import lodash, { TemplateExecutor } from 'lodash';

export const emailSubjectTemplates: Record<string, TemplateExecutor> = {
    registration: lodash.template('Your registration application has been submitted, ${firstName}')
}

export const emailBodyTemplates: Record<string, TemplateExecutor> = {
    registration:  lodash.template([
        "Hi ${firstName}!<br>Your registration application to the Timeline Trust Student Console has been recieved successfully. Your registration ID is ${code}",
        "We'll be in touch with next steps once your application has been reviewed by the administrators.",
        "Best regards",
        "Timeline Trust"]
        .join("\n")
    )
}




