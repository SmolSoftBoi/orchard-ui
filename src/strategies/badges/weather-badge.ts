import { Service } from '../../home';
import { LovelaceBadgeConfig } from '../../lovelace';

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
