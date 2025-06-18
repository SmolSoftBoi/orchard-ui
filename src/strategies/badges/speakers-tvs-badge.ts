import { Entity } from '@smolpack/hasskit';
import { LovelaceBadgeConfig } from '../../lovelace';

/**
 * Strategy for generating badges for speakers or televisions.
 */
export class SpeakersTvsBadgeStrategy {
  /**
   * Build the badge configuration for media player entities.
   *
   * @param mediaPlayerEntity - The media player to display.
   * @returns The resulting badge configuration.
   */
  static async generate(
    mediaPlayerEntity: Entity,
  ): Promise<LovelaceBadgeConfig> {
    return {
      type: 'entity',
      entity: mediaPlayerEntity.uniqueIdentifier,
      name: mediaPlayerEntity.name,
      icon: mediaPlayerEntity.icon || 'mdi:television-speaker',
      show_name: true,
      visibility: [
        {
          condition: 'or',
          conditions: [
            {
              condition: 'state',
              entity: mediaPlayerEntity.uniqueIdentifier,
              state: 'on',
            },
            {
              condition: 'state',
              entity: mediaPlayerEntity.uniqueIdentifier,
              state: 'playing',
            },
            {
              condition: 'state',
              entity: mediaPlayerEntity.uniqueIdentifier,
              state: 'buffering',
            },
          ],
        },
      ],
    };
  }
}
