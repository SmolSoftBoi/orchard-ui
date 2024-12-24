import { Service } from '../home';
import { LovelaceCardConfig } from '../lovelace';

export class ClimateCardStategy {
  static async generate(climateService: Service): Promise<LovelaceCardConfig> {
    return {
      type: 'tile',
      entity: climateService.id,
      name: climateService.name,
      control: 'climate',
    };
  }
}
