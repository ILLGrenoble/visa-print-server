import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IncomingMessage } from 'http';
import { Observable } from 'rxjs';

@Injectable()
export class RestAuthGuard implements CanActivate {
    constructor(private configService: ConfigService) {}

    getCaseInsensitiveHeader(header: string, req: IncomingMessage): string {
        const lowerCaseHeader = header.toLowerCase();
        for (const requestHeader in req.headers) {
            if (requestHeader.toLowerCase() === lowerCaseHeader) {
                return req.headers[requestHeader] as string;
            }
        }
    }

    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const authToken = this.configService.get<string>('server.authToken');
        if (authToken) {
            const request = context.switchToHttp().getRequest();
            return authToken === this.getCaseInsensitiveHeader('x-auth-token', request);
        } else {
            return true;
        }
    }
}
