import { Entity } from '@smolpack/hasskit';
import { LovelaceCardConfig } from '../../lovelace';

export class SwitchCardStrategy {
  static async generate(switchEntity: Entity): Promise<LovelaceCardConfig> {
    return {
      type: 'tile',
      entity: switchEntity.uniqueIdentifier,
    };
  }
}
