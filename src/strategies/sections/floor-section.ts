import { Floor, LightEntity } from '@smolpack/hasskit';
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

    for (const area of floor.areas) {
      for (const climateService of area.entitiesWithDomains(['climate'])) {
        promises.push(ClimateCardStategy.generate(climateService));
      }
    }

    for (const area of floor.areas) {
      if (area.lightEntityGroups) {
        for (const lightEntity of area.lightEntityGroups) {
          promises.push(LightCardStrategy.generate(lightEntity));
        }
      } else {
        for (const lightEntity of area.entitiesWithDomains([
          'light',
        ]) as LightEntity[]) {
          promises.push(LightCardStrategy.generate(lightEntity));
        }
      }
    }

    for (const room of floor.rooms) {
      const lockEntities = room.entitiesWithDomains(['lock']);

      if (lockEntities) {
        for (const lockEntity of lockEntities) {
          promises.push(SecurityCardStrategy.generate(lockEntity));
        }
      }
    }

    for (const room of floor.rooms) {
      const mediaPlayerEntities = room.entitiesWithDomains(['media_player']);

      if (mediaPlayerEntities) {
        for (const mediaPlayerEntity of mediaPlayerEntities) {
          promises.push(SpeakerTvCardStrategy.generate(mediaPlayerEntity));
        }
      }
    }

    return [...(await Promise.all(promises))];
  }
}
