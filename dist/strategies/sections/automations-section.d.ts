import { Floor, Home } from '@smolpack/hasskit';
import { HassFloorRegistryEntry } from '../../hass';
import { LovelaceCardConfig, LovelaceSectionRawConfig } from '../../lovelace';
export type AutomationSectionStrategyConfig = {
    floor?: HassFloorRegistryEntry;
};
/**
 * Display available automations grouped by area or floor.
 */
export declare class AutomationSectionStrategy {
    /**
     * Build the section configuration.
     *
     * @param home - The home instance.
     * @param floor - Optional floor filter.
     * @returns Lovelace section configuration.
     */
    static generate(home: Home, floor?: Floor): Promise<LovelaceSectionRawConfig>;
    /**
     * Create the list of automation cards.
     *
     * @param home - The home instance.
     * @param floor - Optional floor context.
     * @returns List of card configs.
     */
    static generateCards(home: Home, floor?: Floor): Promise<LovelaceCardConfig[]>;
}
