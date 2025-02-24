import { Client } from '@elastic/elasticsearch';
import { Injectable } from '@nestjs/common';
import { CustomLogger } from 'src/common/logger.service';

@Injectable()
export class LogService {
  private readonly logger = new CustomLogger(LogService.name);
  private static client = new Client({
    node: process.env.ELASTICSEARCH_URL || 'http://localhost:9200',
  });
  private _client = LogService.client;

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
}
