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
    fetch(`https://sms.arkesel.com/sms/api?action=send-sms&api_key=${ServicesConfig.arkesel.api_key}&to=${validPhoneNumber(phone)}&from=${"Timeline"}&sms=${smsBodyTemplates[purpose](actualdata)}`)
    //.then(response => console.log(response))
    .catch(error => console.log(error));

    // SMS API V2
    // const SMSdata = {
    //   message: `${smsBodyTemplates[purpose](actualdata)}`,
    //   recipients: [`${validPhoneNumber(phone)}`],
    //   sender: "Timeline",
    // };

    // const headers = {
    //   "Content-Type": "application/json",
    //   "api-key": ServicesConfig.arkesel.api_key,
    // };
  
    // fetch("https://sms.arkesel.com/api/v2/sms/send", {
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
