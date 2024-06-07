import { config } from "@repo/config";
import { emailHandler } from "./handlers/notifications/send-email";
import { createClient } from "redis";
import os from 'os';
import cluster from 'cluster'
import async from 'neo-async';

const streamHandlers = [
    {
        streamKey: 'notifications.send-email',
        handler: emailHandler,
    }   
]


export async function start(){

     // Connect Redis
     const redis = await createClient({
        url: config.redis.url,
        socket: {
            reconnectStrategy: function(retries) {
                if (retries > 20) {
                    console.log("--- Services Error ---")
                    console.log("Too many attempts to reconnect. Redis connection was terminated");
                    return new Error("Too many retries.");
                } else {
                    return retries * 500;
                }
            }
        }
    }).connect();

    streamHandlers.forEach( async ({ streamKey, handler}) => {
        try{
            await redis.xGroupCreate(
                streamKey,
                config.redis.notifications,
                '$',
                {
                    MKSTREAM: true,
                }
            )
            console.log(`Redis stream ${streamKey} created`)

            async.forever(
                async (next) => {
                    const response = await redis.xReadGroup(
                        streamKey,
                        os.hostname() + ":" + ( cluster?.worker?.id || process.pid.toString()),
                        {
                            key: ">",
                            id: "0-0"
                        },
                        {
                            COUNT: 1,
                            BLOCK: 5000,
                        }
                    )
                    for (let res in response){
                        console.log(res);
                    }

                },

                (err) => {
                    console.log('Async Error: ', err)
                }

            )


        } catch(err) { 
            console.log(err)

        }

    })


}