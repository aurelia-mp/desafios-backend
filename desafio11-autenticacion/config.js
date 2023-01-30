import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


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
    }
}
