import { Injectable } from '@nestjs/common';
import amqp, { ChannelWrapper } from 'amqp-connection-manager';
import { Channel } from 'amqplib';
import { CustomLogger } from './logger.service';

@Injectable()
export class RabbitmqProvider {
  private readonly logger = new CustomLogger(RabbitmqProvider.name);
  private channelWrapper: ChannelWrapper;
  private readonly queueName = process.env.QUEUE_NAME || 'ORDER_QUEUE';
  constructor() {
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

      this.logger.registerOrderLog('Order sent to queue', id);
    } catch (error) {
      this.logger.registerOrderLog('Failed to send order to queue:', id, error);
    }
  }
}
