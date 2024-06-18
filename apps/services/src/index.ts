import mongoose from "mongoose"
import { start } from "./start";
import { ServicesConfig } from "../config";

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
    }

})()