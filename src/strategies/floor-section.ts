import { Floor } from '../home';
import { LovelaceCardConfig, LovelaceSectionRawConfig } from '../lovelace';
import { ClimateCardStategy } from './climate-card';
import { FloorHeadingCardStrategy } from './floor-heading-card';
import { LightCardStrategy } from './light-card';
import { SpeakerTvCardStrategy } from './speaker-tv-card';

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
      for (const climateService of room.climateServices) {
        promises.push(ClimateCardStategy.generate(climateService));
      }
    }

    for (const room of floor.rooms) {
      if (room.lightServiceGroups) {
        for (const lightService of room.lightServiceGroups) {
          promises.push(LightCardStrategy.generate(lightService));
        }
      } else {
        for (const lightService of room.lightServices) {
          promises.push(LightCardStrategy.generate(lightService));
        }
      }
    }

    for (const room of floor.rooms) {
      if (room.speakerTvServices) {
        for (const speakerTvService of room.speakerTvServices) {
          promises.push(SpeakerTvCardStrategy.generate(speakerTvService));
        }
      }
    }

    return [...(await Promise.all(promises))];
  }
}
