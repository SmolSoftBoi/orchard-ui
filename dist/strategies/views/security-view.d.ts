import { ReactiveElement } from 'lit';
import { LovelaceBadgeConfig, LovelaceSectionRawConfig, LovelaceViewConfig } from '../../lovelace';
import { Hass } from '../../hass';
/**
 * View strategy displaying security devices.
 */
export declare class SecurityViewStrategy extends ReactiveElement {
    /**
     * Build the security view configuration.
     *
     * @param config - View configuration object.
     * @param hass - Home Assistant instance.
     * @returns The Lovelace view configuration.
     */
    static generate(config: object, hass: Hass): Promise<LovelaceViewConfig>;
    /**
     * Create badges for the security view.
     *
     * @param config - View configuration object.
     * @param hass - Home Assistant instance.
     * @returns Array of badge configs.
     */
    static generateBadges(config: object, hass: Hass): Promise<LovelaceBadgeConfig[]>;
    /**
     * Build sections for the security view.
     *
     * @param config - View configuration object.
     * @param hass - Home Assistant instance.
     * @returns Section configuration list.
     */
    static generateSections(config: object, hass: Hass): Promise<LovelaceSectionRawConfig[]>;
}
