import { Service } from '../home';
import { LovelaceBadgeConfig } from '../lovelace';

export class SpeakersTvsBadgeStrategy {
  static async generate(service: Service): Promise<LovelaceBadgeConfig> {
    return {
      type: 'entity',
      entity: service.id,
      name: 'Speakers & TVs',
      icon: 'mdi:television-speaker',
      show_name: true,
      visibility: [
        {
          condition: 'or',
          conditions: [
            {
              condition: 'state',
              entity: service.id,
              state: 'on',
            },
            {
              condition: 'state',
              state: 'playing',
            },
            {
              condition: 'state',
              state: 'buffering',
            },
          ],
        },
      ],
    };
  }
}
