/* eslint-disable @typescript-eslint/no-misused-promises */
import { ConsoleLogger, Injectable } from '@nestjs/common';
import { Client } from '@elastic/elasticsearch';

@Injectable()
export class CustomLogger extends ConsoleLogger {
  private readonly client: Client;

  constructor(context?: string) {
    super(context || '');
    this.client = new Client({
      node: process.env.ELASTICSEARCH_URL || 'http://localhost:9200',
    });
  }

  log(message: string, ...optionalParams: [...any, string?]) {
    super.log(message, ...optionalParams);
  }

  async registerOrderLog(message: string, orderId: string, trace?: string) {
    super.log(message);
    await this.client.index({
      index: 'logs',
      body: {
        message,
        orderId,
        timestamp: new Date().toISOString(),
        trace,
      },
    });
  }

  async error(message: string, ...optionalParams: [...any, string?, string?]) {
    super.error(message, optionalParams);
    await this.indexLog('error', message);
  }

  warn(message: string, ...optionalParams: [...any, string?]) {
    super.log(message, ...optionalParams);
  }

  private async indexLog(
    level: string,
    message: string,
    context?: string,
    trace?: string,
  ) {
    try {
      await this.client.index({
        index: 'logs',
        body: {
          timestamp: new Date().toISOString(),
          level,
          message,
          context,
          trace,
        },
      });
    } catch (error) {
      super.error('Unexpected error sending a message to elasticSearch', error);
    }
  }
}
