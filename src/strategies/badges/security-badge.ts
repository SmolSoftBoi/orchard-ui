import { Entity } from '@smolpack/hasskit';
import { LovelaceBadgeConfig } from '../../lovelace';

/**
 * Generate badges for security related entities.
 */
export class SecurityBadgeStrategy {
  /**
   * Build the badge configuration for a lock or alarm entity.
   *
   * @param securityEntity - The security entity to display.
   * @returns The generated badge configuration.
   */
  static async generate(securityEntity: Entity): Promise<LovelaceBadgeConfig> {
    return {
      type: 'entity',
      entity: securityEntity.uniqueIdentifier,
      name: securityEntity.name,
      icon: securityEntity.icon || 'mdi:lock',
      show_name: true,
      state_content: ['state'],
    };
  }
}
