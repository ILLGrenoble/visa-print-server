import { Logger, UseGuards } from '@nestjs/common';
import { OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { WsAuthGuard } from '../guards';
import { FileData } from '../types';

@WebSocketGateway()
export class PrinterGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer()
    server: Server;

    private readonly logger: Logger;

    constructor() {
        this.logger = new Logger(PrinterGateway.name);
        this.logger.log('Created PrinterGateway');
    }

    @UseGuards(WsAuthGuard)
    @SubscribeMessage('enablePrint')
    handleEnablePrint(client: Socket): boolean {
        client.join('printer_clients');
        this.logger.log(`client ${client.id} is now receiving printer data`);
        return true;
    }

    @UseGuards(WsAuthGuard)
    @SubscribeMessage('disablePrint')
    handleDisablePrint(client: Socket): boolean {
        client.leave('printer_clients');
        this.logger.log(`client ${client.id} is no longer receiving printer data`);
        return true;
    }

    sendPrinterFile(fileData: FileData): Promise<void> {
        const printerClientsCount = this.server.sockets.adapter.rooms.get('printer_clients')?.size || 0;
        if (printerClientsCount == 0) {
            throw new Error('No clients connected');
        }

        return new Promise<void>((resolve, reject) => {
            this.server
                .to('printer_clients')
                .timeout(60000)
                .emit('print', fileData, (err: any, responses: any[]) => {
                    if (err) {
                        reject(err);
                    } else {
                        this.logger.log(`Received ${responses.length} responses`);
                        resolve();
                    }
                });
        });
    }

    afterInit(/*server: Server*/): void {
        this.logger.log('Init');
    }

    handleDisconnect(client: Socket): void {
        this.logger.log(`Client disconnected: ${client.id}`);
    }

    handleConnection(client: Socket): void {
        this.logger.log(`Client connected: ${client.id}`);
    }
}
