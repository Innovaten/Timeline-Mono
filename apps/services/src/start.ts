import { config } from "@repo/config";
import { emailHandler } from "./handlers/notifications/send-email";
import os from 'os';
import cluster from 'cluster'
import { Kafka } from "kafkajs";

const kafka = new Kafka({
  clientId: 'timeline-services',
  brokers: config.kafka.brokers,
})


const streamHandlers = [
    {
        streamKey: 'notifications.send-email',
        handler: emailHandler,
    }   
]


export async function start(){
    const consumer = kafka.consumer({ 
        groupId: 'timeline-services:' + os.hostname + ":" + (cluster.worker?.id ?? process.pid ) 
    })

    streamHandlers.forEach( async ({ streamKey, handler}) => {
        try{
            await consumer.subscribe({ topic: streamKey, fromBeginning: true})
            consumer.run({
                eachMessage: handler
            })            
        } catch(err) { 
            console.log(err)
        }
    })
}