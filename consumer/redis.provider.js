const { default: Redis } = require("ioredis");

const redisConnection = new Redis({
  host: process.env.REDIS_HOST,
  port: Number(process.env.REDIS_PORT),
});

exports.deleteCache = async (key) => {
  try {
    await redisConnection.del(key);
  } catch (error) {
    console.error("Error deleting cache:", error);
  }
}

exports.redisConnection = redisConnection;