import graylog2 from 'graylog2';

const environment =
  process.env.BOT_NAME === 'Ghostdrivebotbot' ? 'DEV' : 'PROD';

const logger = new graylog2.graylog({
  servers: [
    {
      host: `${process.env.GRAYLOG_HOST_BACK}`,
      port: process.env.GRAYLOG_PORT_BACK
    }
  ],
  hostname: 'TG bot',
  facility: 'backend',
  defaults: {
    environment
  }
});

export default logger;
