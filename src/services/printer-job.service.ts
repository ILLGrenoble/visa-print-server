import { Injectable, Logger } from '@nestjs/common';
import { FileData, PrintJob, WebsocketConfig } from '../types';
import { PrinterGateway } from '../gateways';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PrinterJobService {
    private readonly logger: Logger;

    constructor(
        private readonly printerGateway: PrinterGateway,
        private readonly configService: ConfigService,
    ) {
        this.logger = new Logger(PrinterJobService.name);
    }

    async processJob(jobId: number, fileData: FileData): Promise<void> {
        const chunks = this.createPrintJobs(jobId, fileData);

        try {
            this.logger.log(`Transferring ${chunks.length} chunks for print job ${jobId} (file '${fileData.fileName}' of length ${fileData.length} bytes)`);

            for (const printJob of chunks) {
                await this.printerGateway.sendPrinterJob(printJob);
            }

            this.logger.log(`Print job ${jobId} transferred successfully`);
        } catch (error) {
            this.logger.error(`Received error during transfer of print job ${jobId}: ${error.message}`);
            throw error;
        }
    }

    private createPrintJobs(jobId: number, fileData: FileData): PrintJob[] {
        // Create chunks
        const maxChunkLength = this.configService.get<WebsocketConfig>('ws').maxData;
        let start = 0;
        let end = 0;
        const chunks: PrintJob[] = [];
        const base64 = fileData.data;
        const chunkCount = Math.ceil(base64.length / maxChunkLength);
        while (start < base64.length) {
            end = Math.min(base64.length, end + maxChunkLength);
            const printJob: PrintJob = {
                jobId: jobId,
                chunkCount: chunkCount,
                chunkId: chunks.length + 1,
                chunkLength: end - start,
                data: fileData.data.slice(start, end),
                fileLength: fileData.length,
                fileName: fileData.fileName,
            };
            chunks.push(printJob);

            start = end;
        }

        const totalChunkSize = chunks.reduce((acc, chunk) => {
            return acc + chunk.chunkLength;
        }, 0);

        if (totalChunkSize != base64.length) {
            this.logger.warn(`Total chunk size is inconsistent with file data size`);
            throw new Error('Failed to correctly chunk the file data');
        }

        return chunks;
    }
}
