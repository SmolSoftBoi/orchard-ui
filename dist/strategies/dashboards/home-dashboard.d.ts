import { ReactiveElement } from 'lit';
import { Hass } from '../../hass';
import { LovelaceConfig, LovelaceViewRawConfig } from '../../lovelace';
import { HomeViewStrategyConfig } from '../views/home-view';
import { Home } from '@smolpack/hasskit';
import { DeepPartial } from '../../utils';
export type HomeDashboardStrategyConfig = HomeViewStrategyConfig;
/**
 * Generate a multi-view dashboard for the entire home.
 */
export declare class HomeDashboardStrategy extends ReactiveElement {
    static logPrefix: string;
    /**
     * Build the Lovelace dashboard configuration.
     *
     * @param partialConfig - Optional override values.
     * @param hass - The Home Assistant connection.
     * @returns The final dashboard configuration.
     */
    static generate(partialConfig: DeepPartial<HomeDashboardStrategyConfig>, hass: Hass): Promise<LovelaceConfig>;
    /**
     * Normalize the input configuration.
     *
     * @param partialConfig - Config values supplied by the user.
     * @returns The completed configuration object.
     */
    static createConfig(partialConfig: DeepPartial<HomeDashboardStrategyConfig>): HomeDashboardStrategyConfig;
    /**
     * Generate the dashboard views.
     *
     * @param home - The home representation.
     * @param config - The processed configuration.
     * @returns The view configurations.
     */
    static generateViews(home: Home, config: HomeDashboardStrategyConfig): Promise<LovelaceViewRawConfig[]>;
}
