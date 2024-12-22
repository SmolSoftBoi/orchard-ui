import { Hass, HassEntityRegistryDisplayEntry } from '../hass';
import { LovelaceBadgeConfig } from '../lovelace';

export type SecurityBadgeStrategyConfig = {
  entity_id?: string;
};

export class SecurityBadgeStrategy {
  static async generate(
    config: SecurityBadgeStrategyConfig,
    hass: Hass,
  ): Promise<LovelaceBadgeConfig | undefined> {
    const badge = {
      type: 'entity',
      entity: config.entity_id || this.homeEntity(hass)?.entity_id,
      name: 'Security',
      icon: 'mdi:lock',
      show_name: true,
      state_content: ['state'],
    };

    return badge;
  }

  static homeEntity(hass: Hass): HassEntityRegistryDisplayEntry | undefined {
    const securityEntities = Object.values(hass.entities).filter((entity) =>
      entity.entity_id.startsWith('lock.'),
    );

    if (securityEntities.length === 1) {
      return securityEntities[0];
    }
  }
}
