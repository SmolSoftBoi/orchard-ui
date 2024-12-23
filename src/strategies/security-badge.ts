import {
  Hass,
  HassEntityRegistryDisplayEntry,
  HassFloorRegistryEntry,
} from '../hass';
import { LovelaceBadgeConfig } from '../lovelace';

export type SecurityBadgeStrategyConfig = {
  floor?: HassFloorRegistryEntry;
};

export type SecurityBadgeStrategyEntityConfig = {
  floor?: HassFloorRegistryEntry;
};

export type SecurityBadgeStrategyEntityFloorConfig = {
  floor: HassFloorRegistryEntry;
};

export class SecurityBadgeStrategy {
  static async generate(
    config: SecurityBadgeStrategyConfig,
    hass: Hass
  ): Promise<LovelaceBadgeConfig | undefined> {
    const entity = this.entity({ floor: config.floor }, hass);

    if (!entity) {
      return;
    }

    const badge = {
      type: 'entity',
      entity: entity.entity_id,
      name: 'Security',
      icon: 'mdi:lock',
      show_name: true,
      state_content: ['state'],
    };

    return badge;
  }

  static entity(
    config: SecurityBadgeStrategyEntityConfig,
    hass: Hass
  ): HassEntityRegistryDisplayEntry | undefined {
    if (config.floor) {
      return this.floorEntity({ floor: config.floor }, hass);
    }

    return this.homeEntity(hass);
  }

  static homeEntity(hass: Hass): HassEntityRegistryDisplayEntry | undefined {
    const securityEntities = Object.values(hass.entities).filter((entity) =>
      entity.entity_id.startsWith('lock.')
    );

    if (securityEntities.length === 1) {
      return securityEntities[0];
    }
  }

  static floorEntity(
    config: SecurityBadgeStrategyEntityFloorConfig,
    hass: Hass
  ): HassEntityRegistryDisplayEntry | undefined {
    const securityEntities = Object.values(hass.entities).filter((entity) =>
      entity.entity_id.startsWith('lock.')
    );

    const areas = Object.values(hass.areas).filter(
      (area) => area.floor_id === config.floor.floor_id
    );

    const areaSecurityEntities: HassEntityRegistryDisplayEntry[] = [];

    for (const area of areas) {
      const areaDevices = Object.values(hass.devices).filter(
        (device) => device.area_id === area.area_id
      );

      for (const device of areaDevices) {
        areaSecurityEntities.push(
          ...securityEntities.filter((entity) => entity.device_id === device.id)
        );
      }

      areaSecurityEntities.push(
        ...securityEntities.filter((entity) => entity.area_id === area.area_id)
      );
    }

    if (areaSecurityEntities.length === 1) {
      return securityEntities[0];
    }
  }
}
