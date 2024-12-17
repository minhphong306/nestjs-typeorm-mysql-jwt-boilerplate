import { Injectable } from '@nestjs/common';
import { exec } from 'child_process';
import { promisify } from 'util';
import { ConfigService } from '@nestjs/config';
import { sendSlackNotification, initializeSlack } from '../../utils/slack';

const execAsync = promisify(exec);

@Injectable()
export class RunService {
  constructor(private readonly configService: ConfigService) {
    initializeSlack(configService);
  }

  async runPlaywrightTest(testName: string) {
    try {
      const codePath = this.configService.get<string>('CODE_PATH');
      if (!codePath) {
        throw new Error('CODE_PATH environment variable is not set');
      }

      const command = `cd ${codePath} && npx playwright test -g "${testName}"`;
      console.log('Running command:', command);
      
      execAsync(command);

      await sendSlackNotification(true, 'Trigger test successfully');
      
      return {
        success: true,
      };
    } catch (error) {
      await sendSlackNotification(false, error.message);
      return {
        success: false,
        error: error.message,
      };

      
    }
  }
}
