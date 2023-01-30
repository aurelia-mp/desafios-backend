import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
import MongoStore from 'connect-mongo'


const advancedOptions = {
    useNewUrlParser: true,
    useUnifiedTopology: true
}

export default {
    PORT: process.env.PORT || 8080,
    mongoLocal: {
        mongoUrl: "mongodb://localhost/sesiones"
    },
    mongoRemote: {
        
    },
    sqlite3: {
        client: 'sqlite3',
        connection : {
            filename: __dirname + './DB/ecommerce.sqlite'
        },
        useNullAsDefault: true
    },
    mariaDb: {
        client: 'mysql',
        connection: {
            host: '127.0.0.1',
            user: 'root',
            password: 'root',
            database: 'coderhouse_01',
            port: 8889
        }
    },
    fileSystem: {
        path: './DB'
    },
    session:{
        store: MongoStore.create({
            // local
            mongoUrl: 'mongodb://localhost/sesiones',
            mongoOptions: advancedOptions,
            ttl:60,
            collectionName: 'sessions'
        }),
        secret: 'secret',
        resave: false,
        saveUninitialized: false,
        cookie: {
            maxAge: 10000
        }
    }
}
