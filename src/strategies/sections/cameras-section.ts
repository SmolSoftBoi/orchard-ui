import { Entity, Home } from '@smolpack/hasskit';
import { LovelaceCardConfig, LovelaceSectionRawConfig } from '../../lovelace';
import { CameraCardStrategy } from '../cards/camera-card';
import { HomeViewStrategy } from '../views/home-view';

export class CamerasSectionStrategy {
  static async generate(
    home: Home,
    cameraEntities: Entity[]
  ): Promise<LovelaceSectionRawConfig> {
    return {
      type: 'grid',
      cards: await this.generateCards(cameraEntities),
      column_span: HomeViewStrategy.maxColumns(home.floors),
    };
  }

  static async generateCards(
    cameraEntities: Entity[]
  ): Promise<LovelaceCardConfig[]> {
    const cards: LovelaceCardConfig[] = [
      {
        type: 'heading',
        heading: 'Cameras',
        icon: 'mdi:video',
        tap_action: {
          action: 'navigate',
          navigation_path: `/cameras`,
        },
      },
    ];

    const promises = [];

    for (const camera of cameraEntities) {
      promises.push(CameraCardStrategy.generate(camera));
    }

    cards.push(...(await Promise.all(promises)));

    return cards;
  }
}
