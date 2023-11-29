export type ServerConfig = {
    host: string;
    port: number;
    authToken?: string;
};

export type WebsocketConfig = {
    maxData: number;
};

export type Config = {
    server: ServerConfig;
    ws: WebsocketConfig;
};
