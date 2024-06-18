import { smsBodyTemplates } from "../templates/sms-templates";
import { ServicesConfig } from "../../../config";
import { EachMessagePayload } from "kafkajs";
import { LMSKafkaMessage } from "../..";

export async function sendOTPHandler(KafkaArgs: EachMessagePayload) {
  try {

    const { purpose, data }: LMSKafkaMessage = JSON.parse(KafkaArgs.message.value!.toString())
    
    const OTPdata = {
      expiry: 5,
      length: 6,
      medium: "sms",
      message: `${smsBodyTemplates["registration"]({ firstName: data.firstName })}`,
      number: [`${data.phoneNumber}`],
      sender_id: "Timeline",
      type: "numeric",
    };
    const headers = {
      "Content-Type": "application/json",
      "api-key": ServicesConfig.arkesel.api_key,
    };
  
    fetch("https://sms.arkesel.com/api/otp/generate", {
      method: "POST",
      headers: headers,
      body: JSON.stringify(OTPdata),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
      })

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
