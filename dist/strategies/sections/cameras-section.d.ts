import { Entity, Home } from '@smolpack/hasskit';
import { LovelaceCardConfig, LovelaceSectionRawConfig } from '../../lovelace';
/**
 * Render a section listing all camera entities.
 */
export declare class CamerasSectionStrategy {
    /**
     * Build the camera section.
     *
     * @param home - The home representation.
     * @param cameraEntities - List of camera entities to show.
     * @returns Section configuration.
     */
    static generate(home: Home, cameraEntities: Entity[]): Promise<LovelaceSectionRawConfig>;
    /**
     * Create the camera cards for the section.
     *
     * @param cameraEntities - Cameras to display.
     * @returns Array of camera cards.
     */
    static generateCards(cameraEntities: Entity[]): Promise<LovelaceCardConfig[]>;
}
