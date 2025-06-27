import { LightEntity } from '@smolpack/hasskit';
import { LovelaceCardConfig } from '../../lovelace';
/**
 * Build tiles for light controls.
 */
export declare class LightCardStrategy {
    /**
     * Generate a card for a light entity.
     *
     * @param lightEntity - The light to control.
     * @returns The card configuration.
     */
    static generate(lightEntity: LightEntity): Promise<LovelaceCardConfig>;
    /**
     * Determine which light features to expose.
     *
     * @param lightEntity - The light entity to inspect.
     * @returns The feature list for the card.
     */
    static generateFeatures(lightEntity: LightEntity): Promise<{
        type: string;
    }[]>;
}
