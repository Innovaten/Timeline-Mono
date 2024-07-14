import os from 'os';
import cluster from 'cluster'
import { Kafka } from "kafkajs";
import { ServicesConfig } from "../config";

import { emailHandler } from "./handlers/notifications/send-email";
import { sendSMSHandler } from "./handlers/notifications/send-sms";

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
        streamKey: 'notifications.send-sms',
        handler: sendSMSHandler
    }
]


export async function start(){
    streamHandlers.forEach( async ({ streamKey, handler}, idx) => {
        const consumer = kafka.consumer({ 
            groupId: 'timeline-services:' + os.hostname + ":" + idx + ":" + (cluster.worker?.id ?? process.pid ) 
        })
        try{
            await consumer.subscribe({ topic: streamKey })
            await consumer.run({
                autoCommit: true,
                eachMessage: handler
            })            
        } catch(err) { 
            console.log(err)
        }
    })
}