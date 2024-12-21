import { ReactiveElement } from 'lit';
import { CUSTOM_ELEMENT_NAME } from '../config';
import { Hass } from '../hass';
import { LovelaceConfig } from '../lovelace';

type HomeDashboardStrategyConfig = {
  floor_id?: string;
  areas?: string[];
};

export class FloorDashboardStrategy extends ReactiveElement {
  static async generate(
    config: HomeDashboardStrategyConfig,
    hass: Hass,
  ): Promise<LovelaceConfig> {
    if (!config.floor_id)
      return {
        views: [],
      };

    const floor = hass.floors[config.floor_id];

    if (!floor)
      return {
        views: [],
      };

    const strategy: LovelaceConfig = {
      views: [
        {
          type: 'sections',
          title: floor.floor_id,
          path: floor.floor_id,
          icon: floor.icon || undefined,
          max_columns: 2,
          strategy: {
            type: `custom:${CUSTOM_ELEMENT_NAME}-floor`,
            floor_id: floor.floor_id,
          },
        },
      ],
    };

    const areas = Object.values(hass.areas)
      .filter((area) => area.floor_id === floor.floor_id)
      .sort((areaA, areaB) => {
        const indexA = config.areas?.indexOf(areaA.area_id) ?? -1;
        const indexB = config.areas?.indexOf(areaB.area_id) ?? -1;
        return indexA - indexB;
      });

    for (const area of areas) {
      strategy.views.push({
        type: 'sections',
        title: area.name,
        path: area.area_id,
        strategy: {
          type: `custom:${CUSTOM_ELEMENT_NAME}-room`,
          area_id: area.area_id,
        },
      });
    }

    return strategy;
  }
}

customElements.define(
  `ll-strategy-${CUSTOM_ELEMENT_NAME}-floor`,
  FloorDashboardStrategy,
);
