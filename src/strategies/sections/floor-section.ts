import Floor from '../../home/zone';
import { LovelaceCardConfig, LovelaceSectionRawConfig } from '../../lovelace';
import { ClimateCardStategy } from '../cards/climate-card';
import { FloorHeadingCardStrategy } from '../cards/floor-heading-card';
import { LightCardStrategy } from '../cards/light-card';
import { SecurityCardStrategy } from '../cards/security-card';
import { SpeakerTvCardStrategy } from '../cards/speaker-tv-card';

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
      if (room.securityServices) {
        for (const securityService of room.securityServices) {
          promises.push(SecurityCardStrategy.generate(securityService));
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
