import { Entity } from '@smolpack/hasskit';
import { LovelaceCardConfig } from '../../lovelace';
/**
 * Strategy for rendering camera tiles.
 */
export declare class CameraCardStrategy {
    /**
     * Build a card for a camera entity.
     *
     * @param cameraEntity - The camera to display.
     * @returns The Lovelace card configuration.
     */
    static generate(cameraEntity: Entity): Promise<LovelaceCardConfig>;
}
