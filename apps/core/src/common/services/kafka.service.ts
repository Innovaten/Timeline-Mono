import { Injectable, OnModuleInit } from "@nestjs/common";
import { Kafka, Producer } from "kafkajs"
import { CoreConfig } from "../../config";

const kafkaTopics = [
    "notifications.send-email",
    "notifications.send-sms",
] as const;

export type KafkaTopic = typeof kafkaTopics[number];


@Injectable()
export class KafkaService implements OnModuleInit {
   
    private producer: Producer;
    

    async onModuleInit() {
        this.producer = new Kafka({
            clientId: 'timeline-core',
            brokers: CoreConfig.kafka.brokers,
            ssl: true,
            sasl: {
                mechanism: 'scram-sha-256',
                username: CoreConfig.kafka.username,
                password: CoreConfig.kafka.password,
            }
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