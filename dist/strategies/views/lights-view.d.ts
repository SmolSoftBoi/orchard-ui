import { ReactiveElement } from 'lit';
import { LovelaceBadgeConfig, LovelaceSectionRawConfig, LovelaceViewConfig } from '../../lovelace';
import { Hass } from '../../hass';
/**
 * Render a view listing all lights.
 */
export declare class LightsViewStrategy extends ReactiveElement {
    /**
     * Build the lights view.
     *
     * @param config - View configuration object.
     * @param hass - Home Assistant instance.
     * @returns The Lovelace view configuration.
     */
    static generate(config: object, hass: Hass): Promise<LovelaceViewConfig>;
    /**
     * Produce the badges for the lights view.
     *
     * @param config - View configuration object.
     * @param hass - Home Assistant instance.
     * @returns Array of badge configs.
     */
    static generateBadges(config: object, hass: Hass): Promise<LovelaceBadgeConfig[]>;
    /**
     * Generate section configurations for the lights view.
     *
     * @param config - View configuration object.
     * @param hass - Home Assistant instance.
     * @returns List of section configs.
     */
    static generateSections(config: object, hass: Hass): Promise<LovelaceSectionRawConfig[]>;
}
