export default {
    microservice: {
        javascript: {
            packages: [
                "dotenv",
                "express",
                "mongoose",
                "helmet",
                "pino"
            ]
        },
        typescript: {
            packages: [
                "dotenv",
                "express",
                "mongoose",
                "helmet",
                "pino",
                "typescript"
            ],
            devpackages: [
                "eslint",
                "@types/dotenv",
                "@types/express",
                "@types/mongoose",
                "@types/node"
            ]
        }
    }
}