import mongoose from "mongoose"
import { start } from "./start";
import { ServicesConfig } from "../config";
import http from 'node:http'

export type LMSKafkaMessage = {
    purpose: string,
    data: Record<string, any>
}

(async function index(){
    try {
        // Connect Mongoose
        await mongoose.connect(ServicesConfig.db.uri, {
            dbName: ServicesConfig.db.database || 'test'
        })

        start();
    } catch (err) {
        console.log("--- Services Error ---")
        console.log(err)
        console.log("*** Auto-Restarting ***")
        index()
    }
    finally {

        const server = http.createServer(
            (req, res) => {
                res.writeHead(200),
                res.end("ping:pong")
            }
        )

        const PORT = 3003
        const HOST = '0.0.0.0'

        server.listen(PORT, HOST, () => {
            console.log(`Services is running. Check health at http(s)://${HOST}:${PORT}`)
        })
    }

})()