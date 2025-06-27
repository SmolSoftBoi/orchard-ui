import { ReactiveElement } from 'lit';
import { LovelaceBadgeConfig, LovelaceSectionRawConfig, LovelaceViewConfig } from '../../lovelace';
import { Hass } from '../../hass';
type FloorViewStrategyConfig = {
    floor_id?: string;
};
/**
 * Strategy for rendering a single floor view.
 */
export declare class FloorViewStrategy extends ReactiveElement {
    /**
     * Build the view representing one floor.
     *
     * @param config - View configuration.
     * @param hass - Home Assistant instance.
     * @returns The view configuration.
     */
    static generate(config: FloorViewStrategyConfig, hass: Hass): Promise<LovelaceViewConfig>;
    /**
     * Generate badges shown at the top of the floor view.
     *
     * @param config - View configuration.
     * @param hass - Home Assistant instance.
     * @returns Badge configuration array.
     */
    static generateBadges(config: FloorViewStrategyConfig, hass: Hass): Promise<LovelaceBadgeConfig[]>;
    /**
     * Build the sections for the floor view.
     *
     * @param config - View configuration.
     * @param hass - Home Assistant instance.
     * @returns Section configuration array.
     */
    static generateSections(config: FloorViewStrategyConfig, hass: Hass): Promise<LovelaceSectionRawConfig[]>;
}
export {};
