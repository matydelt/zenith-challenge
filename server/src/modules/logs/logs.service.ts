import { Client } from '@elastic/elasticsearch';
import { ConsoleLogger, Injectable } from '@nestjs/common';

@Injectable()
export class LogsService {
  private logger = new ConsoleLogger(LogsService.name);
  private static client = new Client({
    node: process.env.ELASTICSEARCH_URL || 'http://localhost:9200',
  });
  private _client = LogsService.client;

  async getOrderLogsById(orderId: string) {
    const result = await this._client.search({
      index: 'logs',
      query: {
        term: {
          orderId,
        },
      },
      sort: [{ timestamp: { order: 'desc' } }],
    });
    return result.hits.hits.map((hit) => hit._source);
  }

  async registerOrderLog(message: string, orderId: string, trace?: string) {
    this.logger.log(message);
    await this._client.index({
      index: 'logs',
      body: {
        message,
        orderId,
        timestamp: new Date().toISOString(),
        trace,
      },
    });
  }
}
