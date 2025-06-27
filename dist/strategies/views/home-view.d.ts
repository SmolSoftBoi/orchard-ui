import { ReactiveElement } from 'lit';
import { Home, Floor } from '@smolpack/hasskit';
import { LovelaceBadgeConfig, LovelaceSectionRawConfig, LovelaceViewConfig } from '../../lovelace';
import { Hass } from '../../hass';
import { ConfigAreas, DeepPartial } from '../../utils';
export type HomeViewStrategyConfig = ConfigAreas;
/**
 * Strategy for the main home view containing floors and system badges.
 */
export declare class HomeViewStrategy extends ReactiveElement {
    /**
     * Build the view configuration.
     *
     * @param config - User provided partial config.
     * @param hass - Home Assistant connection.
     * @returns The Lovelace view configuration.
     */
    static generate(config: DeepPartial<HomeViewStrategyConfig>, hass: Hass): Promise<LovelaceViewConfig>;
    /**
     * Resolve defaults for the view configuration.
     *
     * @param partialConfig - Partial configuration.
     * @returns Completed configuration.
     */
    static createConfig(partialConfig: DeepPartial<HomeViewStrategyConfig>): HomeViewStrategyConfig;
    /**
     * Generate all badges shown on the home view.
     *
     * @param home - The home instance.
     * @returns Array of badge configs.
     */
    static generateBadges(home: Home): Promise<LovelaceBadgeConfig[]>;
    /**
     * Generate the sections for each floor and camera group.
     *
     * @param home - Home context.
     * @returns List of section configs.
     */
    static generateSections(home: Home): Promise<LovelaceSectionRawConfig[]>;
    /**
     * Determine the maximum number of columns allowed.
     *
     * @param floors - Floors within the home.
     * @returns The number of columns.
     */
    static maxColumns(floors: Floor[]): number;
}
