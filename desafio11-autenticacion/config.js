import dotenv from 'dotenv'
import parseArgs from 'minimist'
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
import MongoStore from 'connect-mongo'

dotenv.config()

const argv = parseArgs(process.argv.slice(2), {
    alias: {
        p: 'port',
        m: 'mode'
    },
    default: {
    port: 8080,
    mode: 'FORK'
    }
})

const advancedOptions = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}

export default {
    PORT: argv.port,
    mode: argv.mode,
    mongoLocal: {
        mongoUrl: process.env.MONGO_URL
    },
    mongoRemote: {
        
    },
    sqlite3: {
        client: 'sqlite3',
        connection : {
            filename: __dirname + process.env.SQLITE3
        },
        useNullAsDefault: true
    },
    mariaDb: {
        client: 'mysql',
        connection: {
            host: '127.0.0.1',
            user: process.env.MARIADB_USER,
            password: process.env.MARIADB_PASSWORD,
            database: process.env.MARIADB_DATABASE,
            port: process.env.MARIADB_PORT
        }
    },
    fileSystem: {
        path: process.env.FILESYSTEM
    },
    session:{
        store: MongoStore.create({
            // local
            mongoUrl: process.env.MONGO_URL,
            mongoOptions: advancedOptions,
            ttl:60,
            collectionName: process.env.MONGODB_COLLECTION_NAME
        }),
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
        cookie: {
            maxAge: 600000
        }
    }
}
