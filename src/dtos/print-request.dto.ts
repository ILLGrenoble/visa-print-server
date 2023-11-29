import { Type } from 'class-transformer';
import { IsInt, IsNotEmpty, IsPositive } from 'class-validator';

export class PrintRequestDto {
    @IsNotEmpty()
    @IsInt()
    @IsPositive()
    @Type(() => Number)
    readonly jobId: number;

    @IsNotEmpty()
    readonly fileName: string;
}
