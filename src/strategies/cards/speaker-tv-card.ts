import { Entity } from '@smolpack/hasskit';
import { LovelaceCardConfig } from '../../lovelace';

export class SpeakerTvCardStrategy {
  static async generate(
    mediaPlayerEntity: Entity
  ): Promise<LovelaceCardConfig> {
    return {
      type: 'tile',
      entity: mediaPlayerEntity.uniqueIdentifier,
      features: [
        {
          type: 'media-player-volume-slider',
        },
      ],
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
