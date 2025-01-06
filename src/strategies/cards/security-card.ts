import { Entity } from '@smolpack/hasskit';
import { LovelaceCardConfig } from '../../lovelace';

export class SecurityCardStrategy {
  static async generate(lockEntity: Entity): Promise<LovelaceCardConfig> {
    return {
      type: 'tile',
      entity: lockEntity.uniqueIdentifier,
      features: [
        {
          type: 'lock-commands',
        },
      ],
    };
  }
}
