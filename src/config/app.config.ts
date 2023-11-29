import { Config } from 'src/types';

export default (): Config => ({
    server: {
        host: process.env.VISA_PRINT_SERVER_HOST || 'localhost',
        port: Number(process.env.VISA_PRINT_SERVER_PORT) || 8091,
        authToken: process.env.VISA_PRINT_SERVER_AUTH_TOKEN,
    },
    ws: {
        maxData: Number(process.env.VISA_PRINT_SERVER_WEBSOCKET_MAX_DATA) || 16384,
    },
});
