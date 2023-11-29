import { Body, Controller, NotFoundException, Post, UseGuards } from '@nestjs/common';
import { PrintDto } from '../dtos';
import { PrinterGateway } from '../gateways';
import { RestAuthGuard } from '../guards';
import { PrinterService } from '../services';

@Controller('printer')
export class PrinterController {
    constructor(
        private readonly printerGateway: PrinterGateway,
        private readonly printerService: PrinterService,
    ) {}

    @UseGuards(RestAuthGuard)
    @Post()
    async printFile(@Body() data: PrintDto): Promise<string> {
        try {
            const fileData = await this.printerService.readFile(data.fileName);
            if (fileData) {
                await this.printerGateway.sendPrinterFile(fileData);
                return 'ok';
            } else {
                throw new NotFoundException();
            }
        } catch (error) {
            throw error;
        }
    }
}
