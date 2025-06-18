import { ReactiveElement } from 'lit';
import { CUSTOM_ELEMENT_NAME } from '../../config';
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
export class FloorDashboardStrategy extends ReactiveElement {
  /**
   * Build the dashboard configuration for one floor.
   *
   * @param config - The user provided config.
   * @param hass - Home Assistant instance.
   * @returns The Lovelace configuration object.
   */
  static async generate(
    config: FloorDashboardStrategyConfig,
    hass: Hass,
  ): Promise<LovelaceConfig> {
    if (!config.floor_id) {
      return {
        views: [],
      };
    }

    const floor = hass.floors[config.floor_id];

    if (!floor) {
      return {
        views: [],
      };
    }

    return {
      views: await this.generateViews(
        { floor: floor, areas: config.areas },
        hass
      ),
    };
  }

  /**
   * Create the views for each room on a floor.
   *
   * @param config - Floor and optional area configuration.
   * @param hass - Home Assistant instance.
   * @returns Array of view configurations.
   */
  static async generateViews(
    config: FloorDashboardStrategyViewsConfig,
    hass: Hass,
  ): Promise<LovelaceViewRawConfig[]> {
    const floor = config.floor;

    const views: LovelaceViewRawConfig[] = [
      {
        type: 'sections',
        title: config.floor.floor_id,
        path: config.floor.floor_id,
        icon: config.floor.icon || undefined,
        max_columns: 2,
        strategy: {
          type: `custom:${CUSTOM_ELEMENT_NAME}-floor`,
          floor_id: config.floor.floor_id,
        },
      },
    ];

    let areas = Object.values(hass.areas).filter(
      (area) => area.floor_id === floor.floor_id
    );

    if (config.areas && config.areas.length > 0) {
      areas = areas.filter((area) =>
        config.areas?.some((configArea) => configArea.area_id === area.area_id)
      );
    }

    for (const area of areas) {
      views.push({
        type: 'sections',
        title: area.name,
        path: area.area_id,
        strategy: {
          type: `custom:${CUSTOM_ELEMENT_NAME}-room`,
          area_id: area.area_id,
        },
      });
    }

    return views;
  }
}

customElements.define(
  `ll-strategy-${CUSTOM_ELEMENT_NAME}-floor`,
  FloorDashboardStrategy
);
