import { ReactiveElement } from 'lit';
import { LovelaceBadgeConfig, LovelaceSectionRawConfig, LovelaceViewConfig } from '../../lovelace';
import { Hass } from '../../hass';
type SpeakersTvsViewStrategyConfig = Record<string, never>;
/**
 * View strategy for all speaker and TV entities.
 */
export declare class SpeakersTvsViewStrategy extends ReactiveElement {
    /**
     * Build the speakers and TVs view.
     *
     * @param config - View configuration object.
     * @param hass - Home Assistant instance.
     * @returns The Lovelace view configuration.
     */
    static generate(config: SpeakersTvsViewStrategyConfig, hass: Hass): Promise<LovelaceViewConfig>;
    /**
     * Create badges for the speakers and TVs view.
     *
     * @param config - View configuration object.
     * @param hass - Home Assistant instance.
     * @returns Array of badge configs.
     */
    static generateBadges(config: SpeakersTvsViewStrategyConfig, hass: Hass): Promise<LovelaceBadgeConfig[]>;
    /**
     * Generate sections for the speakers and TVs view.
     *
     * @param config - View configuration object.
     * @param hass - Home Assistant instance.
     * @returns Section configuration list.
     */
    static generateSections(config: SpeakersTvsViewStrategyConfig, hass: Hass): Promise<LovelaceSectionRawConfig[]>;
}
export {};
