import { ReactiveElement } from 'lit';
import { LovelaceBadgeConfig, LovelaceSectionRawConfig, LovelaceViewConfig } from '../../lovelace';
import { Hass } from '../../hass';
type RoomViewStrategyConfig = {
    area_id?: string;
};
/**
 * Strategy to show devices and information for a single room.
 */
export declare class RoomViewStrategy extends ReactiveElement {
    /**
     * Build the room view.
     *
     * @param config - Room view configuration.
     * @param hass - Home Assistant instance.
     * @returns Lovelace view configuration.
     */
    static generate(config: RoomViewStrategyConfig, hass: Hass): Promise<LovelaceViewConfig>;
    /**
     * Create badges for the room view.
     *
     * @param config - Room view configuration.
     * @param hass - Home Assistant instance.
     * @returns Array of badge configs.
     */
    static generateBadges(config: RoomViewStrategyConfig, hass: Hass): Promise<LovelaceBadgeConfig[]>;
    /**
     * Build the sections for the room view.
     *
     * @param config - Room view configuration.
     * @param hass - Home Assistant instance.
     * @returns Section configuration list.
     */
    static generateSections(config: RoomViewStrategyConfig, hass: Hass): Promise<LovelaceSectionRawConfig[]>;
}
export {};
