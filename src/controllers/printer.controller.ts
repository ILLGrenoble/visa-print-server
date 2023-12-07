import { Body, Controller, InternalServerErrorException, NotFoundException, Post, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { PrintRequestDto } from '../dtos';
import { RestAuthGuard } from '../guards';
import { FileService, PrinterJobService } from '../services';

@Controller('printer')
export class PrinterController {
    constructor(
        private readonly fileService: FileService,
        private readonly printerJobService: PrinterJobService,
    ) {}

    @Post()
    @UsePipes(new ValidationPipe({ transform: true }))
    @UseGuards(RestAuthGuard)
    async printFile(@Body() request: PrintRequestDto): Promise<string> {
        try {
            const fileData = await this.fileService.readFile(request.path);
            if (!fileData) {
                throw new NotFoundException();
            }
            try {
                await this.printerJobService.processJob(request.jobId, fileData);
                return 'ok';
            } catch (error) {
                throw new InternalServerErrorException(error.message);
            }
        } catch (error) {
            throw error;
        }
    }
}
