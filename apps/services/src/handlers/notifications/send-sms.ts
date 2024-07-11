import { smsBodyTemplates } from "../templates/sms-templates";
import { ServicesConfig } from "../../../config";
import { EachMessagePayload } from "kafkajs";
import { LMSKafkaMessage } from "../..";
import { validPhoneNumber } from "../../utils";

export async function sendSMSHandler(KafkaArgs: EachMessagePayload) {
  try {

    const { purpose, data }: LMSKafkaMessage = JSON.parse(KafkaArgs.message.value!.toString())
    
    const { phone, ...actualdata} = data;

    const SMSdata = {
      message: `${smsBodyTemplates[purpose](actualdata)}`,
      recipients: [`${validPhoneNumber(phone)}`],
      sender: "Timeline Trust",
    };

    const headers = {
      "Content-Type": "application/json",
      "api-key": ServicesConfig.arkesel.api_key,
    };
  
    fetch("https://sms.arkesel.com/api/v2/sms/send", {
      method: "POST",
      headers: headers,
      body: JSON.stringify(SMSdata),
    })
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
    })
    
    console.log("Sent", purpose, "SMS to", phone)

  } catch(err){
    console.log('--- Kafka SMS OTP Handler Error ---\n', err)
  }
}

// export async function verifyOTP(phoneNumber:String, otp: String) {
//     const data = {
//       code: `${otp}`,
//       number: `${phoneNumber}`,
//     };

//     const headers = {
//       'Content-Type':'application/json',
//       'api-key':  ServicesConfig.arkesel.api_key,
//     }

//     fetch('https://sms.arkesel.com/api/otp/verify', {
//         method: 'POST',
//         headers: headers,
//         body: JSON.stringify(data),

//       })
//       .then(response => response.json())
//       .then(data => console.log(data))
//       .catch(error => console.error('Error:', error));
// }
