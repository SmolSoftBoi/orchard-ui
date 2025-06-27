import { ClimateEntity } from '@smolpack/hasskit';
import { LovelaceCardConfig } from '../../lovelace';
/**
 * Render controls for climate devices.
 */
export declare class ClimateCardStrategy {
    /**
     * Build a climate control card.
     *
     * @param climateEntity - The climate entity to control.
     * @returns The Lovelace card configuration.
     */
    static generate(climateEntity: ClimateEntity): Promise<LovelaceCardConfig>;
    /**
     * Build a list of features for the climate card.
     *
     * @param climateEntity - The climate entity to inspect.
     * @returns The features to enable.
     */
    static generateFeatures(climateEntity: ClimateEntity): Promise<object[]>;
}
