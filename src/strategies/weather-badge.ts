import { LovelaceBadgeConfig } from '../lovelace';
import { Service } from '../home/service';

export class WeatherBadgeStrategy {
  static async generate(service: Service): Promise<LovelaceBadgeConfig> {
    return {
      type: 'entity',
      entity: service.id,
      name: 'Weather',
      show_name: true,
      state_content: ['state', 'temperature'],
    };
  }
}
