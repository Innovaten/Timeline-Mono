import { EachMessagePayload } from "kafkajs";
import { emailSubjectTemplates, emailBodyTemplates } from "../templates/email-templates";
import { config } from "@repo/config";
import Mailgun from 'mailgun.js'
import FormData from 'form-data'; // Hmmmm

type LMSKafkaMessage = {
    purpose: string,
    data: Record<string, any>
}
// const mg = new Mailgun(FormData).client({ username: 'api', key: config.mail.mailgun_key})

export async function emailHandler(KafkaArgs: EachMessagePayload){
    try {
        const { purpose, data }: LMSKafkaMessage = JSON.parse(KafkaArgs.message.value!.toString())
    
        const { email, ...templateData} = data;
        const emailSubject = emailSubjectTemplates[purpose]({ ...data})
        const emailBody = emailBodyTemplates[purpose]({ ...data})
        sendRequestToMG({ email, subject: emailSubject, body:emailBody })
        console.log(`Sent ${purpose} email to ${email}`)
    } catch (err) {
        console.log('--- Kafka Email Handler Error ---\n', err)
    }
}

type RequestToMGArgs = {
    email: string,
    subject: string,
    body: string,
}

async function sendRequestToMG(args: RequestToMGArgs) {
    // mg.messages.create(config.mail.mailgun_domain, { // Change to real account when in prod
    //     to: [args.email],
    //     from: 'Timeline Trust Support <noreply-timeline-support@mg.kodditor.co>',
    //     bcc: ['kobbyowusudarko@gmail.com'],
    //     subject: args.subject,
    //     html: `
    //     <html>
    //       ${args.body}
    //     </html>
    //     `})
}