import { IncomingWebhook } from '@slack/webhook';
import { ConfigService } from '@nestjs/config';

let webhook: IncomingWebhook;

export const initializeSlack = (configService: ConfigService) => {
    const webhookUrl = configService.get<string>('SLACK_WEBHOOK_URL');
    if (webhookUrl) {
        webhook = new IncomingWebhook(webhookUrl);
    }
};

export const sendSlackNotification = async (success: boolean, message: string) => {
    if (!webhook) {
        console.warn('Slack webhook not initialized. Message not sent:', message);
        return;
    }

    const icon = success ? ':white_check_mark:' : ':x:';
    const color = success ? '#36a64f' : '#ff0000';

    try {
        await webhook.send({
            attachments: [{
                color,
                blocks: [
                    {
                        type: 'section',
                        text: {
                            type: 'mrkdwn',
                            text: `${icon} ${message}`
                        }
                    }
                ]
            }]
        });
    } catch (error) {
        console.error('Failed to send Slack notification:', error);
    }
};
