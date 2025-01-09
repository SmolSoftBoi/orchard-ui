import { Entity } from '@smolpack/hasskit';
import { LovelaceBadgeConfig } from '../../lovelace';
export class SecurityBadgeStrategy {
  static async generate(securityEntity: Entity): Promise<LovelaceBadgeConfig> {
    return {
      type: 'entity',
      entity: securityEntity.uniqueIdentifier,
      name: securityEntity.name,
      icon: 'mdi:lock',
      show_name: true,
      state_content: ['state'],
    };
  }
}
