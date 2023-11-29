import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import { ServerConfig } from './types';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
    const logger = new Logger('Main');
    const app = await NestFactory.create(AppModule);
    app.setGlobalPrefix('api');

    const configService = app.get<ConfigService>(ConfigService);
    const serverConfig = configService.get<ServerConfig>('server');
    logger.log(`Server listening on ${serverConfig.host}:${serverConfig.port}`);
    await app.listen(serverConfig.port, serverConfig.host);
}
bootstrap();
