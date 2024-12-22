import { Hass } from '../hass';
import { LovelaceBadgeConfig } from '../lovelace';

export class WasteBadgeStrategy {
  static async generate(
    config: object,
    hass: Hass
  ): Promise<LovelaceBadgeConfig> {
    return {
      type: 'entity',
    };
  }
}
