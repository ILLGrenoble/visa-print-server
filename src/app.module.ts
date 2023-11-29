import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController, PrinterController } from './controllers';
import { AppService } from './services';
import { PrinterGateway } from './gateways';
import { RestAuthGuard, WsAuthGuard } from './guards';
import appConfig from './config/app.config';
import { PrinterService } from './services/printer.service';

@Module({
    imports: [
        ConfigModule.forRoot({
            load: [appConfig],
        }),
    ],
    controllers: [AppController, PrinterController],
    providers: [AppService, PrinterService, PrinterGateway, RestAuthGuard, WsAuthGuard],
})
export class AppModule {}
