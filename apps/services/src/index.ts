import { createClient } from "redis"
import * as configModule from "@repo/config";
import mongoose from "mongoose"
import { start } from "./start";


(async function index(){
    try {
       

        // Connect Mongoose
        await mongoose.connect(configModule.config.db.uri, {
            dbName: configModule.config.db.database || 'test'
        })

        start();


    } catch (err) {
        console.log("--- Services Error ---")
        console.log(err)
    }

})()