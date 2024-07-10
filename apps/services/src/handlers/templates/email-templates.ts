import lodash, { TemplateExecutor } from 'lodash';

export const emailSubjectTemplates: Record<string, TemplateExecutor> = {
    registration: lodash.template('Your registration application has been submitted, ${firstName}'),
    "registration-approved": lodash.template("You've been approved ${firstName}!"),
    "admin-credentials": lodash.template("You're in, ${firstName}."),
    "registration-rejected": lodash.template("Updates to your registration application"),
    "student-credentials": lodash.template("You're in, ${firstName}.")
}

export const emailBodyTemplates: Record<string, TemplateExecutor> = {
    registration:  lodash.template([
        "Hi ${firstName}!",
        "",
        "Your registration application to the Timeline Trust Student Console has been received successfully.",
        "Your registration ID is ${code}.",
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
        "",
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
    "admin-credentials": lodash.template([
        "Hi ${firstName}!",
        "",
        "You've been given access to the Timeline Trust Admin Console!",
        "Here are your credentials:",
        "",
        "Console URL: <strong>${console}</strong>",
        "Email Address: <strong>${email}</strong>",
        "Password: <strong>${password}</strong>",
        "Admin ID: <strong>${code}</strong>",
        "",
        "Best regards,",
        "Timeline Trust",
        ].join("<br>")
        // Data:
        // firstName
        // code
        // email
        // password
        // console
    ),
    "registration-rejected": lodash.template([
        "Dear ${firstName},",
        "",
        "We hope this email finds you well. We regret to inform you that your application to the Timeline Trust LMS console has been rejected.",
        "We know this response was not what you hoped for, but we thank you for your continued interest and wish you the best in your future studies.",
        "",
        "Best Regards,",
        "Timeline Trust",
    ].join("<br>")
    // Data:
    // firstName
    // email
),
    "student-credentials": lodash.template([
        "Hi ${firstName}!",
        "",
        "You've been given access to the Timeline Trust Student Console!",
        "Here are your credentials:",
        "",
        "Console URL: <strong>${console}</strong>",
        "Email Address: <strong>${email}</strong>",
        "Password: <strong>${password}</strong>",
        "Student ID: <strong>${code}</strong>",
        "",
        "Best regards,",
        "Timeline Trust",
        ].join("<br>")
        // Data:
        // firstName
        // code
        // email
        // password
        // console
    ),
}




