import { Entity } from '@smolpack/hasskit';
import { LovelaceCardConfig } from '../../lovelace';

/**
 * Render a simple switch tile.
 */
export class SwitchCardStrategy {
  /**
   * Create a card for a switch entity.
   *
   * @param switchEntity - The switch to render.
   * @returns The card configuration.
   */
  static async generate(switchEntity: Entity): Promise<LovelaceCardConfig> {
    return {
      type: 'tile',
      entity: switchEntity.uniqueIdentifier,
    };
  }
}
