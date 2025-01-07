import { Entity } from '@smolpack/hasskit';
import { LovelaceBadgeConfig } from '../../lovelace';

export class SpeakersTvsBadgeStrategy {
  static async generate(
    mediaPlayerEntity: Entity
  ): Promise<LovelaceBadgeConfig> {
    return {
      type: 'entity',
      entity: mediaPlayerEntity.uniqueIdentifier,
      name: 'Speakers & TVs',
      icon: 'mdi:television-speaker',
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
