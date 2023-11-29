import { Injectable, Logger } from '@nestjs/common';
import { FileData } from '../types';
import { readFile, stat } from 'fs/promises';
import { existsSync } from 'fs';
import { basename } from 'path';

@Injectable()
export class FileService {
    private readonly logger: Logger;

    constructor() {
        this.logger = new Logger(FileService.name);
    }

    async readFile(path: string): Promise<FileData> {
        const exists = existsSync(path);
        if (!exists) {
            this.logger.warn(`File at path ${path} does not exist`);
            return null;
        }

        const stats = await stat(path);
        if (stats && stats.isFile) {
            const data = await readFile(path);

            return {
                fileName: basename(path),
                data: data.toString('base64'),
                length: data.length,
            };
        } else {
            this.logger.warn(`${path} is not a file path`);
            return null;
        }
    }
}
