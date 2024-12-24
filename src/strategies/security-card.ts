import { Service } from '../home';
import { LovelaceCardConfig } from '../lovelace';

export class SecurityCardStrategy {
  static async generate(securityService: Service): Promise<LovelaceCardConfig> {
    return {
      type: 'tile',
      entity: securityService.id,
      features: [
        {
          type: 'lock-commands',
        },
      ],
    };
  }
}
