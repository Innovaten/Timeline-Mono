import { createClient } from "redis"
import { config } from "@repo/config"
import mongoose from "mongoose"
import { start } from "./start";


(async function index(){
    try {
       

        // Connect Mongoose
        await mongoose.connect(config.db.uri, {
            dbName: config.db.database || 'test'
        })

        start();


    } catch (err) {
        console.log("--- Services Error ---")
        console.log(err)
    }

})()