export const CoreConfig = {
    db: {
        uri: process.env.MONGODB_URI ?? 'mongodb://localhost:27017',
        database: process.env.MONGODB_DATABASE ?? 'timeline-test'
    },
    secrets: {
        core: process.env.CORE_SECRET_KEY ?? "this+might+not+be+a+secret"
    },
    ports: {
        core: process.env.CORE_PORT ?? 4000
    },
    url: {
        admin: process.env.ADMIN_URL ?? 'http://localhost:3000',
        lms: process.env.LMS_URL ?? 'http://localhost:3001',
        core: process.env.CORE_URL ?? 'http://localhost:4000',
    },
    kafka: {
        username: process.env.KAFKA_USERNAME ?? "default",
        password: process.env.KAFKA_PASSWORD ?? "123456789",
        brokers: [ 
            process.env.KAFKA_BROKER ?? ""
        ]
    },
    mnotify: {
        api_key: process.env.MNOTIFY_API_KEY ?? "",
    },
}

