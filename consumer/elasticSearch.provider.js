const { Client } = require("@elastic/elasticsearch");


exports.ESClient = class elasticSearchProvider {
  static client;
  constructor() {
    this.client = new Client({
      node: process.env.ELASTICSEARCH_URL || 'http://localhost:9200',
    })
  }

  async register(message, orderId, trace) {
    console.log(message)
    await this.client.index({
      index: 'logs',
      body: {
        timestamp: new Date().toISOString(),
        orderId,
        message,
        trace,
      },
    });
  }
}