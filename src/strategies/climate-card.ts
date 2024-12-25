import { LovelaceCardConfig } from '../lovelace';
import { Service } from '../service';

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
