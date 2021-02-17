import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { LoggerService } from '@nestjs/common';

@Injectable()
export class AuthenticationInterceptor implements NestInterceptor {
  constructor(loggerService: LoggerService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    console.log('==== ===');
    return next.handle();
  }
}
