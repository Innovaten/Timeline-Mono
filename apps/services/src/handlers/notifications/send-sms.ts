import { smsBodyTemplates } from "../templates/sms-templates";
import { config } from "@repo/config/src";

export async function sendOTP(phoneNumber:String, firstName: String) {
    const data = {
    expiry: 5,
    length: 6,
    medium: 'sms',
    message: `${smsBodyTemplates["registration"]({firstName})}`,
    number: `${phoneNumber}`,
    sender_id: 'Timeline',
    type: 'numeric',
    };
    const headers = {
    'Content-Type': 'application/json',
    'api-key':  config.arkesel.arkesel_api_key,
    }

    fetch('https://sms.arkesel.com/api/otp/generate', {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(data),

      })
      .then(response => response.json())
      .then(data => console.log(data))
      .catch(error => console.error('Error:', error));
      
}

export async function verifyOTP(phoneNumber:String, otp: String) {
    const data = {
    api_key: config.arkesel.arkesel_api_key,
    code: `${otp}`,
    number: `${phoneNumber}`,
    };

    const headers = {
    'Content-Type':'application/json',
    'api-key':  "aE1WdGJJd05lTHJLSmFnd3ptVkQ",
    }

    fetch('https://sms.arkesel.com/api/otp/verify', {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(data),

      })
      .then(response => response.json())
      .then(data => console.log(data))
      .catch(error => console.error('Error:', error));
}