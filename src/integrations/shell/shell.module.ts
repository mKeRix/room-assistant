import { DynamicModule, Module } from '@nestjs/common';
import { ShellService } from './shell.service';
import { ConfigModule } from '../../config/config.module';
import { EntitiesModule } from '../../entities/entities.module';

@Module({
  providers: [ShellService]
})
export default class ShellModule {
  static forRoot(): DynamicModule {
    return {
      module: ShellModule,
      imports: [ConfigModule, EntitiesModule],
      providers: [ShellService]
    };
  }
}
