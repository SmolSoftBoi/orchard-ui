import { ReactiveElement } from 'lit';
import { Home } from '@smolpack/hasskit';
import { LovelaceBadgeConfig, LovelaceSectionRawConfig, LovelaceViewConfig } from '../../lovelace';
import { Hass } from '../../hass';
import { ConfigAreas } from '../../utils';
export type AutomationsViewStrategyConfig = ConfigAreas;
/**
 * Show automations grouped by floor and area.
 */
export declare class AutomationsViewStrategy extends ReactiveElement {
    /**
     * Build the automations view.
     *
     * @param partialConfig - Partial configuration from the dashboard.
     * @param hass - Home Assistant instance.
     * @returns Lovelace view configuration.
     */
    static generate(partialConfig: AutomationsViewStrategyConfig, hass: Hass): Promise<LovelaceViewConfig>;
    /**
     * Normalize the automations view config.
     *
     * @param partialConfig - Partial configuration.
     * @returns Completed configuration.
     */
    static createConfig(partialConfig: AutomationsViewStrategyConfig): AutomationsViewStrategyConfig;
    /**
     * Currently there are no badges for the automations view.
     *
     * @returns Empty array of badges.
     */
    static generateBadges(): Promise<LovelaceBadgeConfig[]>;
    /**
     * Create automation sections for home and each floor.
     *
     * @param home - Home context.
     * @returns Array of section configs.
     */
    static generateSections(home: Home): Promise<LovelaceSectionRawConfig[]>;
    /**
     * Determine column count for the view grid.
     *
     * @param home - Home context.
     * @returns Number of columns.
     */
    static maxColumns(home: Home): number;
}
