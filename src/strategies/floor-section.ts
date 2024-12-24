import { Floor } from '../home';
import { LovelaceCardConfig, LovelaceSectionRawConfig } from '../lovelace';
import { FloorHeadingCardStrategy } from './floor-heading-card';

export class FloorSectionStrategy {
  static async generate(floor: Floor): Promise<LovelaceSectionRawConfig> {
    return {
      type: 'grid',
      cards: await this.generateCards(floor),
    };
  }

  static async generateCards(floor: Floor): Promise<LovelaceCardConfig[]> {
    const promises = [await FloorHeadingCardStrategy.generate(floor)];

    for (const room of floor.rooms) {
      if (room.lightServiceGroups) {
        for (const lightService of room.lightServiceGroups) {
          promises.push({
            type: 'tile',
            entity: lightService.id,
          });
        }
      } else {
        for (const lightService of room.lightServices) {
          promises.push({
            type: 'tile',
            entity: lightService.id,
          });
        }
      }
    }

    return [...(await Promise.all(promises))];
  }
}
