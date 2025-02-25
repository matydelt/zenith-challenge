import { ConsoleLogger, Injectable } from '@nestjs/common';
import amqp, { ChannelWrapper } from 'amqp-connection-manager';
import { Channel } from 'amqplib';
import { LogsService } from 'src/modules/logs/logs.service';

@Injectable()
export class MessageBrokerService {
  private readonly logger = new ConsoleLogger(MessageBrokerService.name);
  private channelWrapper: ChannelWrapper;
  private readonly queueName = process.env.QUEUE_NAME || 'ORDER_QUEUE';

  constructor(private readonly logsService: LogsService) {
    const connection = amqp.connect([process.env.RABBITMQ_URL]);
    this.channelWrapper = connection.createChannel({
      setup: (channel: Channel) => {
        return channel.assertQueue(this.queueName, { durable: true });
      },
    });
  }

  sendMessage(id: string) {
    try {
      const message = {
        orderId: id,
      };
      this.channelWrapper.sendToQueue(
        this.queueName,
        Buffer.from(JSON.stringify(message)),
      );

      this.logsService.registerOrderLog('Order sent to queue', id);
    } catch (error) {
      this.logsService.registerOrderLog(
        'Failed to send order to queue:',
        id,
        error,
      );
    }
  }
}
