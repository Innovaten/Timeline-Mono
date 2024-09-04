export const CoreConfig = {
    db: {
        uri: process.env.MONGODB_URI ?? 'mongodb://localhost:27017',
        database: process.env.MONGODB_DATABASE ?? 'timeline-test'
    },
    s3: {
        bucket: process.env.S3_BUCKET ?? "",
        region: process.env.S3_REGION ?? "",
        access_key: process.env.S3_ACCESS_KEY ?? "",
        secret_access_key: process.env.S3_SECRET_ACCESS_KEY ?? "",
    },
    secrets: {
        core: process.env.CORE_SECRET_KEY ?? "this+might+not+be+a+secret"
    },
    ports: {
        core: process.env.PORT ?? 4000
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
    redis: {
        host: process.env.REDIS_HOST ?? '127.0.0.1',
        port: parseInt(process.env.REDIS_PORT ?? '6379'),
        password: process.env.REDIS_PASSWORD ?? "",
        username: process.env.REDIS_USERNAME ?? 'default'
    }
}

