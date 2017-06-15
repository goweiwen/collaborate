import Redis from 'koa-redis';

export default new Redis({ url: process.env.REDIS_URL });
