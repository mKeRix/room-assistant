import { DynamicModule, Module } from "@nestjs/common";
import { ConfigModule } from "../../config/config.module";
import { EntitiesModule } from "../../entities/entities.module";
import { StatusModule } from "../../status/status.module";
import { MqttService } from "./mqtt.service";

@Module({})
export default class MqttModule {
  static forRoot(): DynamicModule {
    return {
      module: MqttModule,
      imports: [ConfigModule, EntitiesModule, StatusModule],
      providers: [MqttService]
    }
  }
}
