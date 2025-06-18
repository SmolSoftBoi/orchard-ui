import { Entity } from '@smolpack/hasskit';
import { LovelaceCardConfig } from '../../lovelace';

/**
 * Build tiles for media player control.
 */
export class SpeakerTvCardStrategy {
  /**
   * Create a tile for a speaker or TV entity.
   *
   * @param mediaPlayerEntity - The media player to render.
   * @returns The card configuration.
   */
  static async generate(
    mediaPlayerEntity: Entity,
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
