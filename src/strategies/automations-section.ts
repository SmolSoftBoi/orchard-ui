import { Hass, HassFloorRegistryEntry } from '../hass';
import { LovelaceCardConfig, LovelaceSectionRawConfig } from '../lovelace';
import { AutomationCardStrategy } from './automation-card';

export type AutomationSectionStrategyConfig = {
  floor?: HassFloorRegistryEntry;
};

export class AutomationSectionStrategy {
  static async generate(
    config: AutomationSectionStrategyConfig,
    hass: Hass
  ): Promise<LovelaceSectionRawConfig> {
    return {
      type: 'grid',
      cards: await this.generateCards(config, hass),
      column_span: config.floor
        ? 1
        : Math.max(Object.keys(hass.floors).length, 1),
    };
  }

  static async generateCards(
    config: AutomationSectionStrategyConfig,
    hass: Hass
  ): Promise<LovelaceCardConfig[]> {
    const cards: LovelaceCardConfig[] = [];

    const automationEntities = Object.values(hass.entities)
      .filter((entity) => entity.entity_id.startsWith('automation.'))
      .sort(
        (entityA, entityB) =>
          Date.parse(
            hass.states[entityB.entity_id].attributes.last_triggered as string
          ) -
          Date.parse(
            hass.states[entityA.entity_id].attributes.last_triggered as string
          )
      );

    if (config.floor) {
      cards.push({
        type: 'heading',
        heading: config.floor.name,
        icon: config.floor.icon || undefined,
        heading_style: 'title',
      });

      const areas = Object.values(hass.areas).filter(
        (area) => area.floor_id === config.floor!.floor_id
      );

      for (const area of areas) {
        const areaAutomations = automationEntities.filter(
          (entity) => entity.area_id === area.area_id
        );

        if (areaAutomations.length === 0) {
          continue;
        }

        cards.push({
          type: 'heading',
          heading: area.name,
          icon: area.icon || undefined,
          heading_style: 'subtitle',
        });

        for (const automation of areaAutomations) {
          cards.push(
            await AutomationCardStrategy.generate({ entity: automation }, hass)
          );
        }
      }

      return cards;
    }

    cards.push({
      type: 'heading',
      heading: 'Home',
      icon: 'mdi:home',
      heading_style: 'title',
    });

    const noAreaAutomations = automationEntities.filter(
      (entity) => !entity.area_id
    );

    for (const automation of noAreaAutomations) {
      cards.push(
        await AutomationCardStrategy.generate({ entity: automation }, hass)
      );
    }

    return cards;
  }
}
