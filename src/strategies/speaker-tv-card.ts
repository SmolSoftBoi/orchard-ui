import { Service } from '../home';
import { LovelaceCardConfig } from '../lovelace';

export class SpeakerTvCardStrategy {
  static async generate(
    speakerTvService: Service
  ): Promise<LovelaceCardConfig> {
    return {
      type: 'media-control',
      entity: speakerTvService.id,
      visibility: [
        {
          condition: 'or',
          conditions: [
            {
              condition: 'state',
              entity: speakerTvService.id,
              state: 'on',
            },
            {
              condition: 'state',
              entity: speakerTvService.id,
              state: 'playing',
            },
            {
              condition: 'state',
              entity: speakerTvService.id,
              state: 'buffering',
            },
          ],
        },
      ],
    };
  }
}
