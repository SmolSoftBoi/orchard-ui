import { ReactiveElement } from 'lit';
import { LovelaceBadgeConfig, LovelaceSectionRawConfig, LovelaceViewConfig } from '../../lovelace';
import { Hass } from '../../hass';
import { Home } from '@smolpack/hasskit';
/**
 * View strategy for displaying climate devices.
 */
export declare class ClimateViewStrategy extends ReactiveElement {
    /**
     * Build the climate view configuration.
     *
     * @param config - View configuration object.
     * @param hass - Home Assistant instance.
     * @returns The view configuration.
     */
    static generate(config: object, hass: Hass): Promise<LovelaceViewConfig>;
    /**
     * Generate badges for the climate view.
     *
     * @param home - Representation of the home.
     * @returns Array of badge configs.
     */
    static generateBadges(home: Home): Promise<LovelaceBadgeConfig[]>;
    /**
     * Build the sections for the climate view.
     *
     * @param home - Representation of the home.
     * @returns Section configuration array.
     */
    static generateSections(home: Home): Promise<LovelaceSectionRawConfig[]>;
}
