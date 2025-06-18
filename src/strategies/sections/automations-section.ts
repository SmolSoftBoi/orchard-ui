import { AutomationEntity, Floor, Home } from '@smolpack/hasskit';
import { HassFloorRegistryEntry } from '../../hass';
import { LovelaceCardConfig, LovelaceSectionRawConfig } from '../../lovelace';
import { AutomationCardStrategy } from '../cards/automation-card';
import { AutomationsViewStrategy } from '../views/automations-view';

export type AutomationSectionStrategyConfig = {
  floor?: HassFloorRegistryEntry;
};

/**
 * Display available automations grouped by area or floor.
 */
export class AutomationSectionStrategy {
  /**
   * Build the section configuration.
   *
   * @param home - The home instance.
   * @param floor - Optional floor filter.
   * @returns Lovelace section configuration.
   */
  static async generate(
    home: Home,
    floor?: Floor,
  ): Promise<LovelaceSectionRawConfig> {
    return {
      type: 'grid',
      cards: await this.generateCards(home, floor),
      column_span: AutomationsViewStrategy.maxColumns(home),
    };
  }

  /**
   * Create the list of automation cards.
   *
   * @param home - The home instance.
   * @param floor - Optional floor context.
   * @returns List of card configs.
   */
  static async generateCards(
    home: Home,
    floor?: Floor,
  ): Promise<LovelaceCardConfig[]> {
    const cards: LovelaceCardConfig[] = [];

    const automationEntities = (
      home.entitiesWithDomains(['automation']) as AutomationEntity[]
    ).sort(
      (entityA, entityB) =>
        entityA.state.lastTriggered.getDate() -
        entityB.state.lastTriggered.getDate()
    );

    if (floor) {
      cards.push({
        type: 'heading',
        heading: floor.name,
        icon: floor.icon,
        heading_style: 'title',
      });

      for (const area of floor.areas) {
        const areaAutomationEntities = area.entitiesWithDomains([
          'automation',
        ]) as AutomationEntity[];

        if (areaAutomationEntities.length === 0) {
          continue;
        }

        cards.push({
          type: 'heading',
          heading: area.name,
          icon: area.icon,
          heading_style: 'subtitle',
        });

        for (const areaAutomationEntity of areaAutomationEntities) {
          cards.push(
            await AutomationCardStrategy.generate(areaAutomationEntity)
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

    const noAreaAutomationEntities = automationEntities.filter(
      (entity) => !entity.areaIdentifier
    );

    for (const automationEntity of noAreaAutomationEntities) {
      cards.push(await AutomationCardStrategy.generate(automationEntity));
    }

    return cards;
  }
}
