import { Injectable } from '@nestjs/common';
import { exec } from 'child_process';
import { promisify } from 'util';
import { ConfigService } from '@nestjs/config';

const execAsync = promisify(exec);

@Injectable()
export class RunService {
  constructor(private readonly configService: ConfigService) {}

  async runPlaywrightTest(testName: string) {
    try {
      const codePath = this.configService.get<string>('CODE_PATH');
      if (!codePath) {
        throw new Error('CODE_PATH environment variable is not set');
      }

      const command = `cd ${codePath} && npx playwright test -g "${testName}"`;
      console.log('Running command:', command);
      
      const { stdout, stderr } = await execAsync(command);
      
      return {
        success: true,
        stdout,
        stderr,
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        stdout: error.stdout,
        stderr: error.stderr,
      };
    }
  }
}
