import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Observable } from 'rxjs';

@Injectable()
export class WsAuthGuard implements CanActivate {
    constructor(private configService: ConfigService) {}

    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const authToken = this.configService.get<string>('server.authToken');
        if (authToken) {
            const request = context.switchToWs().getClient().handshake;
            // Get token from auth (v4 client) or query (v2 client)
            const clientToken = request.auth?.token || request.query?.token;
            return authToken === clientToken;
        } else {
            return true;
        }
    }
}
