import { EachMessagePayload } from "kafkajs";
import { emailSubjectTemplates, emailBodyTemplates } from "../templates/email-templates";
import { ServicesConfig } from "../../../config";
import { LMSKafkaMessage } from "../..";
import { Resend } from "resend";

const resend = new Resend(ServicesConfig.mail.api_key);

export async function emailHandler(KafkaArgs: EachMessagePayload){
    try {
        const { purpose, data }: LMSKafkaMessage = JSON.parse(KafkaArgs.message.value!.toString())
    
        const emailSubject = emailSubjectTemplates[purpose]({ ...data})
        const emailBody = emailBodyTemplates[purpose]({ ...data})
        const emailMetadata = await sendEmailRequest({ email: data.email, subject: emailSubject, body: emailBody })
       
        console.log(`Sent ${purpose} email to ${data.email}. Email ID: ${emailMetadata?.data?.id}`)
    
    } catch (err: any) {
        console.log('--- Kafka Email Handler Error ---\n', err.message ? err.message : err)
    }
}

type RequestToMGArgs = {
    email: string,
    subject: string,
    body: string,
}

async function sendEmailRequest(args: RequestToMGArgs) {
    try{
        const sendEmail = await resend.emails.send({
            from: `Timeline Trust Support <timelinetrust@${ServicesConfig.mail.domain}>`,
            to: [args.email],
            subject: args.subject,
            html: `
            <html>
              ${args.body}
            </html>
        `})

        if(sendEmail.error){
            throw new Error(sendEmail.error.name + ": " + sendEmail.error.message)
        }
        
        return sendEmail;

    } catch (err: any) {
        console.log(`--- Resend Error ---\n`, err.message ? err.message : err)
    }
}