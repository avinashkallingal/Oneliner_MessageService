import config from './config';

interface RabbitMqConfig {
    rabbitMQ: {
        url: string;
        queues: {
            messageQueue:'message_queue'
        };
    };
}

const rabbitMQConfig: RabbitMqConfig = {
    rabbitMQ: {
        url: config.rabbitMq_url,
        queues: {
            messageQueue:'message_queue'
        }
    }
}

export default rabbitMQConfig;