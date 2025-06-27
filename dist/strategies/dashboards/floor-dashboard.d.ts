import { ReactiveElement } from 'lit';
import { Hass, HassFloorRegistryEntry } from '../../hass';
import { LovelaceConfig, LovelaceViewRawConfig } from '../../lovelace';
type FloorDashboardStrategyConfig = {
    floor_id?: string;
    areas?: FloorDashboardStrategyConfigArea[];
};
type FloorDashboardStrategyViewsConfig = {
    floor: HassFloorRegistryEntry;
    areas?: FloorDashboardStrategyConfigArea[];
};
type FloorDashboardStrategyConfigArea = {
    area_id?: string;
};
/**
 * Strategy for dashboards that focus on a single floor.
 */
export declare class FloorDashboardStrategy extends ReactiveElement {
    /**
     * Build the dashboard configuration for one floor.
     *
     * @param config - The user provided config.
     * @param hass - Home Assistant instance.
     * @returns The Lovelace configuration object.
     */
    static generate(config: FloorDashboardStrategyConfig, hass: Hass): Promise<LovelaceConfig>;
    /**
     * Create the views for each room on a floor.
     *
     * @param config - Floor and optional area configuration.
     * @param hass - Home Assistant instance.
     * @returns Array of view configurations.
     */
    static generateViews(config: FloorDashboardStrategyViewsConfig, hass: Hass): Promise<LovelaceViewRawConfig[]>;
}
export {};
