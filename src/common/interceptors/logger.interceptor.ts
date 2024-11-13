import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
// import chalk from 'chalk';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { LoggerService } from '../services/logger.service';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  constructor(private readonly logger: LoggerService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const now = Date.now();
    const httpContext = context.switchToHttp();
    const request = httpContext.getRequest<any>();

    const ip = this.getIP(request);

    this.logger.log(`Incoming Request on ${request.url}`, `method=${request.method} ip=${ip}`);
    //   const parentType = chalk
    //   .hex('#87e8de')
    //   .bold(`${context.getArgs()[0].route.path}`);
    // const fieldName = chalk
    //   .hex('#87e8de')
    //   .bold(`${context.getArgs()[0].route.stack[0].method}`);
    return next.handle().pipe(
      tap(() => {
        //   this.logger.debug(`⛩  ${parentType} » ${fieldName}`, 'RESTful');
        this.logger.log(
          `End Request for ${request.url}`,
          `method=${request.method} ip=${ip} duration=${Date.now() - now}ms`,
        );
      }),
    );
  }

  private getIP(request: any): string {
    let ip: string;
    const ipAddr = request.headers['x-forwarded-for'];
    if (ipAddr) {
      ip = ipAddr[ipAddr.length - 1];
    } else {
      ip = request.socket.remoteAddress;
    }
    return ip.replace('::ffff:', '');
  }
}
