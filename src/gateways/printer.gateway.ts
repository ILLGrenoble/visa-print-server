import { Logger, UseGuards } from '@nestjs/common';
import { OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { WsAuthGuard } from '../guards';
import { PrintJob } from '../types';

@WebSocketGateway({ allowEIO3: true })
export class PrinterGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer()
    server: Server;

    private readonly logger: Logger;

    constructor() {
        this.logger = new Logger(PrinterGateway.name);
        this.logger.log('Created PrinterGateway');
    }

    @UseGuards(WsAuthGuard)
    @SubscribeMessage('enable_print')
    handleEnablePrint(client: Socket): boolean {
        client.join('printer_clients');
        this.logger.log(`client ${client.id} is now receiving printer data`);
        return true;
    }

    @UseGuards(WsAuthGuard)
    @SubscribeMessage('disable_print')
    handleDisablePrint(client: Socket): boolean {
        client.leave('printer_clients');
        this.logger.log(`client ${client.id} is no longer receiving printer data`);
        return true;
    }

    @UseGuards(WsAuthGuard)
    @SubscribeMessage('print_job_handled')
    handlePrintJobHandled(client: Socket, jobId: number): void {
        this.logger.log(`client ${client.id} has handled the print job ${jobId}`);
        client.broadcast.emit('print_job_handled', jobId);
    }

    sendPrinterJob(printJob: PrintJob): Promise<void> {
        const printerRoom = this.server.sockets.adapter.rooms.get('printer_clients');
        if (!printerRoom || printerRoom.size == 0) {
            this.logger.warn(`No clients are connected to receive the print job`);
            throw new Error('No clients connected');
        }

        return new Promise<void>((resolve, reject) => {
            this.server
                .to('printer_clients')
                .timeout(10000)
                .emit('print', printJob, (err: any, responses: any[]) => {
                    if (err) {
                        this.logger.warn(`Received an error during send of chunk ${printJob.chunkId}/${printJob.chunkCount} of job ${printJob.jobId} data: ${err.message}`);
                    }
                    const okCount = responses.filter((response) => response === true).length;
                    if (okCount > 0) {
                        if (okCount === responses.length) {
                            this.logger.debug(`All ${responses.length} clients received correctly chunk ${printJob.chunkId}/${printJob.chunkCount} of job ${printJob.jobId}`);
                        } else {
                            this.logger.warn(`Only ${okCount} / ${responses.length} clients received correctly chunk ${printJob.chunkId}/${printJob.chunkCount} of job ${printJob.jobId}`);
                        }
                        resolve();
                    } else {
                        reject(new Error('No client sucessfully received the print job'));
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
