import { ConsoleLogger, Controller, Get, Param } from '@nestjs/common';
import { LogsService } from './logs.service';
import { ObjectIdPipe } from 'src/common/pipes/objectid.pipe';

@Controller('logs')
export class LogsController {
  private readonly logger = new ConsoleLogger(LogsController.name);

  constructor(private readonly logService: LogsService) {}

  @Get('/orders/:orderId')
  async getOrderLogsById(@Param('orderId', ObjectIdPipe) orderId: string): Promise<any> {
    try {
      return this.logService.getOrderLogsById(orderId);
    } catch (error) {
      this.logger.error(error);
    }
  }
}
