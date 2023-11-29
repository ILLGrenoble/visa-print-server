export type ServerConfig = {
    host: string;
    port: number;
    authToken?: string;
};

export type Config = {
    server: ServerConfig;
};
