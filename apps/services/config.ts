export const ServicesConfig = {
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
    arkesel: {
        api_key: process.env.ARKESEL_API_KEY ?? "",
    },
    mail: {
        api_key: process.env.MAILGUN_API_KEY ?? "",  
        domain: process.env.MAILGUN_DOMAIN ?? ""
    }
    
}

