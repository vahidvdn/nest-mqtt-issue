import { Controller, Get, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    @Inject('MQTT_SERVICE') private client: ClientProxy,
  ) {
    setInterval(() => {
      this.sendMsg();
    }, 3000);
  }

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  async sendMsg() {
    console.log('sending msg...');
    await this.client.emit('testFailure', 5).subscribe({
      next: () => {
        console.log('sent!!');
      },
      error: (err) => {
        // this does not log when you stop mqtt (let say clear the port 1883) after initial start of application was successfull
        // but works when the port is not available from the start point of application
        console.log('emiiiiiiiiiiiitiit err', err);
      },
    });
  }
}
