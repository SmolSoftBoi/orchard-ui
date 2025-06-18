import { Entity } from '@smolpack/hasskit';
import { LovelaceCardConfig } from '../../lovelace';

/**
 * Strategy for rendering camera tiles.
 */
export class CameraCardStrategy {
  /**
   * Build a card for a camera entity.
   *
   * @param cameraEntity - The camera to display.
   * @returns The Lovelace card configuration.
   */
  static async generate(cameraEntity: Entity): Promise<LovelaceCardConfig> {
    return {
      type: 'picture-entity',
      entity: cameraEntity.uniqueIdentifier,
      camera_image: cameraEntity.uniqueIdentifier,
      show_name: false,
      show_state: false,
      camera_view: 'live',
    };
  }
}
