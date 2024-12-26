import { LovelaceCardConfig } from '../lovelace';
import { Service } from '../service';

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