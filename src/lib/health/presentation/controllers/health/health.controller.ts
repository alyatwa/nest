import { Controller, Get, Res } from '@nestjs/common';
import { Response } from 'express';

@Controller('/healthz')
export class HealthController {
  constructor() {}

  @Get('/')
  healthz(@Res() res: Response): void {
    res.status(200).json({
      status: 'Server is working',
    });
  }
}
