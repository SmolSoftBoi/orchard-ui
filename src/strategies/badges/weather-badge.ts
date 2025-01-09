import { Entity } from '@smolpack/hasskit';
import { LovelaceBadgeConfig } from '../../lovelace';

export class WeatherBadgeStrategy {
  static async generate(weatherEntity: Entity): Promise<LovelaceBadgeConfig> {
    return {
      type: 'entity',
      entity: weatherEntity.uniqueIdentifier,
      name: weatherEntity.name,
      show_name: true,
      state_content: ['state', 'temperature'],
    };
  }
}
