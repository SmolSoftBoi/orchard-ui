import { LovelaceBadgeConfig } from '../lovelace';
import { Service } from '../home/service';

export class WasteBadgeStrategy {
  static async generate(wasteService: Service): Promise<LovelaceBadgeConfig> {
    return {
      type: 'entity',
      entity: wasteService.id,
      name: 'Waste',
      show_name: true,
      state_content: ['message'],
    };
  }
}
