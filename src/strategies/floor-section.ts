import { Floor } from '../home';
import { LovelaceCardConfig, LovelaceSectionRawConfig } from '../lovelace';
import { FloorHeadingCardStrategy } from './floor-heading-card';
import { LightCard } from './light-card';

export class FloorSectionStrategy {
  static async generate(floor: Floor): Promise<LovelaceSectionRawConfig> {
    return {
      type: 'grid',
      cards: await this.generateCards(floor),
    };
  }

  static async generateCards(floor: Floor): Promise<LovelaceCardConfig[]> {
    const promises = [FloorHeadingCardStrategy.generate(floor)];

    for (const room of floor.rooms) {
      if (room.lightServiceGroups) {
        for (const lightService of room.lightServiceGroups) {
          promises.push(LightCard.generate(lightService));
        }
      } else {
        for (const lightService of room.lightServices) {
          promises.push(LightCard.generate(lightService));
        }
      }
    }

    return [...(await Promise.all(promises))];
  }
}
