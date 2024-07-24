export const ServicesConfig = {
    node_env: process.env.NODE_ENV ?? 'development',
    db: {
        uri: process.env.MONGODB_URI ?? 'mongodb://localhost:27017',
        database: process.env.MONGODB_DATABASE ?? 'timeline-test'
    },
    kafka: {
        username: process.env.KAFKA_USERNAME ?? "default",
        password: process.env.KAFKA_PASSWORD ?? "123456789",
        brokers: [ 
            process.env.KAFKA_BROKER ?? ""
        ]
    },
    mail: {
        api_key: process.env.RESEND_API_KEY ?? "",  
        domain: process.env.RESEND_DOMAIN ?? "",
    }
    
}

