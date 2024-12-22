import { Hass, HassEntityRegistryDisplayEntry } from '../hass';
import { LovelaceBadgeConfig } from '../lovelace';

export type EnergyBadgeStrategyConfig = {};

export class EnergyBadgeStrategy {
  static globalEntityId = 'sensor.electricity_maps_co2_intensity';

  static async generate(
    config: EnergyBadgeStrategyConfig,
    hass: Hass,
  ): Promise<LovelaceBadgeConfig | void> {
    const entity = this.globalEntity(hass);

    if (entity) {
      return {
        type: 'entity',
        entity: entity.entity_id,
        name: 'Energy',
        icon: 'mdi:lightning-bolt',
        color: 'light-green',
        show_name: true,
      };
    }
  }

  static globalEntity(hass: Hass): HassEntityRegistryDisplayEntry | undefined {
    return hass.entities[this.globalEntityId];
  }
}
