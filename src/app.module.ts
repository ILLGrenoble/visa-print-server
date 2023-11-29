import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrinterController } from './controllers';
import { FileService, PrinterJobService } from './services';
import { PrinterGateway } from './gateways';
import { RestAuthGuard, WsAuthGuard } from './guards';
import appConfig from './config/app.config';

@Module({
    imports: [
        ConfigModule.forRoot({
            load: [appConfig],
        }),
    ],
    controllers: [PrinterController],
    providers: [FileService, PrinterJobService, PrinterGateway, RestAuthGuard, WsAuthGuard],
})
export class AppModule {}
