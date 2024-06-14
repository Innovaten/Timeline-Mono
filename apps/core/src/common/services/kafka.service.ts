import { Injectable, OnModuleInit } from "@nestjs/common";
import { Kafka, Producer } from "kafkajs"
const configModule = require("@repo/config");

const kafkaTopics = [
    "notifications.send-email",
    "notifications.send-sms",
] as const;

type KafkaTopic = typeof kafkaTopics[number];


@Injectable()
export class KafkaService implements OnModuleInit {
   
    private producer: Producer;
    

    async onModuleInit() {
        this.producer = new Kafka({
            clientId: 'timeline-core',
            brokers: configModule.config.kafka.brokers,
          }).producer()
        this.producer.connect()
    }

    async produceMessage(
        topic: KafkaTopic,
        purpose: string,
        data: Record<any, any>
    ) {
        const payload = {
            purpose,
            data,
        } 
        try{
            await this.producer.send({
                topic,
                messages: [{
                    key: 'core',
                    value: JSON.stringify(payload),
                    headers: {
                        source: 'timeline-core'
                    }
                }]
            });

            return true
        } catch(err){
            console.log(err)
            return false
        }
    }
}