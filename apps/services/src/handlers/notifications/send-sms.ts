import { smsBodyTemplates } from "../templates/sms-templates";
import { ServicesConfig } from "../../../config";
import { EachMessagePayload } from "kafkajs";
import { LMSKafkaMessage } from "../..";
import { validPhoneNumber } from "../../utils";

export async function sendSMSHandler(KafkaArgs: EachMessagePayload) {
  try {

    const { purpose, data }: LMSKafkaMessage = JSON.parse(KafkaArgs.message.value!.toString())
    
    console.log(purpose, data);
    const { phone, ...actualdata} = data;

    // SMS API V1

    // SEND SMS
    fetch(`https://apps.mnotify.net/smsapi?key=${ServicesConfig.mnotify.api_key}&to=${validPhoneNumber(phone)}&msg=${smsBodyTemplates[purpose](actualdata)}&sender_id=${"Timeline"}`)
    .then(response => console.log(response))
    .catch(error => console.log(error));

    // SMS API V2
    // const SMSdata = {
    //   message: `${smsBodyTemplates[purpose](actualdata)}`,
    //   recipient: [`${phoneNumber}`],
    //   sender: "Timeline",
    // };

    // const headers = {
    //   "Content-Type": "application/json",
    // };
  
    // fetch("https://api.mnotify.com/api/sms/quick?key=${ServicesConfig.mnotify.api_key}", {
    //   method: "POST",
    //   headers: headers,
    //   body: JSON.stringify(SMSdata),
    // })
    // .then((response) => response.json())
    // .then((data) => {
    //   console.log(data);
    // })


    
    console.log("Sent", purpose, "SMS to", phone)

  } catch(err){
    console.log('--- Kafka SMS OTP Handler Error ---\n', err)
  }
}
