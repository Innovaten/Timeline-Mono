import os from 'os';
import cluster from 'cluster'
import { Kafka } from "kafkajs";
import { ServicesConfig } from "../config";

import { emailHandler } from "./handlers/notifications/send-email";
import { sendOTPHandler } from "./handlers/notifications/send-sms";

const kafka = new Kafka({
  clientId: 'timeline-services',
  brokers: ServicesConfig.kafka.brokers,
  ssl: true,
  sasl: {
    mechanism: 'scram-sha-256',
    username: ServicesConfig.kafka.username,
    password: ServicesConfig.kafka.password,
  }
})


const streamHandlers = [
    {
        streamKey: 'notifications.send-email',
        handler: emailHandler,
    },
    {
        streamKey: 'notifications.send-sms-otp',
        handler: sendOTPHandler
    }
]


export async function start(){
    const consumer = kafka.consumer({ 
        groupId: 'timeline-services:' + os.hostname + ":" + (cluster.worker?.id ?? process.pid ) 
    })

    streamHandlers.forEach( async ({ streamKey, handler}) => {
        try{
            await consumer.subscribe({ topic: streamKey })
            consumer.run({
                eachMessage: handler
            })            
        } catch(err) { 
            console.log(err)
        }
    })
}