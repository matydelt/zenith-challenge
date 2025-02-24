import { Controller, Get, Param } from '@nestjs/common';
import { CustomLogger } from 'src/common/logger.service';
import { LogService } from '../services/log.service';

@Controller('logs')
export class LogsController {
  private readonly logger = new CustomLogger(LogsController.name);

  constructor(private readonly logService: LogService) {}

  @Get('/orders/:orderId')
  async getOrderLogsById(@Param('orderId') orderId: string): Promise<any> {
    try {
      return this.logService.getOrderLogsById(orderId);
    } catch (error) {
      this.logger.error(error);
    }
  }
}
