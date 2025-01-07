import { Entity } from '@smolpack/hasskit';
import { LovelaceBadgeConfig } from '../../lovelace';

export class WeatherBadgeStrategy {
  static async generate(entity: Entity): Promise<LovelaceBadgeConfig> {
    return {
      type: 'entity',
      entity: entity.uniqueIdentifier,
      name: 'Weather',
      show_name: true,
      state_content: ['state', 'temperature'],
    };
  }
}
