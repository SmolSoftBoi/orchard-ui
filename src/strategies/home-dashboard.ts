import { ReactiveElement } from 'lit';
import { CUSTOM_ELEMENT_NAME } from '../config';
import { Hass } from '../hass';
import { LovelaceConfig } from '../lovelace';

type HomeDashboardStrategyConfig = {};

export class HomeDashboardStrategy extends ReactiveElement {
  static async generate(
    config: HomeDashboardStrategyConfig,
    hass: Hass,
  ): Promise<LovelaceConfig> {
    const floors = Object.keys(hass.floors);
    let automationFloorsLength = 0;

    for (const floor of Object.values(hass.floors)) {
      const floorAreas = Object.values(hass.areas).filter(
        (area) => area.floor_id === floor.floor_id,
      );

      for (const area of floorAreas) {
        const areaAutomations = Object.values(hass.entities).filter(
          (entity) =>
            entity.entity_id.startsWith('automation.') &&
            entity.area_id === area.area_id,
        );

        if (areaAutomations.length > 0) {
          automationFloorsLength++;
          break;
        }
      }
    }

    console.log(automationFloorsLength);

    return {
      views: [
        {
          type: 'sections',
          title: 'Home',
          path: 'home',
          icon: 'mdi:home',
          max_columns: Math.max(floors.length, 1),
          strategy: {
            type: `custom:${CUSTOM_ELEMENT_NAME}-home`,
          },
        },
        {
          type: 'sections',
          title: 'Automations',
          icon: 'mdi:alarm',
          max_columns: Math.max(automationFloorsLength, 1),
          strategy: {
            type: `custom:${CUSTOM_ELEMENT_NAME}-automations`,
          },
        },
        {
          type: 'sections',
          title: 'Climate',
          path: 'climate',
          icon: 'mdi:fan',
          strategy: {
            type: `custom:${CUSTOM_ELEMENT_NAME}-climate`,
          },
        },
        {
          type: 'sections',
          title: 'Lights',
          path: 'lights',
          icon: 'mdi:lightbulb-group',
          strategy: {
            type: `custom:${CUSTOM_ELEMENT_NAME}-lights`,
          },
        },
        {
          type: 'sections',
          title: 'Security',
          path: 'security',
          icon: 'mdi:lock',
          strategy: {
            type: `custom:${CUSTOM_ELEMENT_NAME}-security`,
          },
        },
        {
          type: 'sections',
          title: 'Speakers & TVs',
          path: 'speakers-tvs',
          icon: 'mdi:television-speaker',
          strategy: {
            type: `custom:${CUSTOM_ELEMENT_NAME}-speakers-tvs`,
          },
        },
      ],
    };
  }
}

customElements.define(
  `ll-strategy-${CUSTOM_ELEMENT_NAME}-home`,
  HomeDashboardStrategy,
);
