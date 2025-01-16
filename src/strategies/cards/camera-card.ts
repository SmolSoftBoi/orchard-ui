import { Entity } from '@smolpack/hasskit';
import { LovelaceCardConfig } from '../../lovelace';

export class CameraCardStrategy {
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
