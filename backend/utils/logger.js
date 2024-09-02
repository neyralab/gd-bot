import graylog2 from 'graylog2';

const logger = new graylog2.graylog({
  servers: [
    {
      host: `${process.env.GRAYLOG_HOST_BACK}`,
      port: process.env.GRAYLOG_PORT_BACK
    }
  ],
  hostname: process.env.BOT_NAME,
  source: process.env.BOT_NAME,
  facility: 'backend'
});

export default logger;
