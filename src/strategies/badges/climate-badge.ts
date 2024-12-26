import Service from '../../home/service/service';
import { LovelaceBadgeConfig } from '../../lovelace';

export class ClimateBadgeStrategy {
  static async generate(service: Service): Promise<LovelaceBadgeConfig> {
    return {
      type: 'entity',
      entity: service.id,
      name: 'Climate',
      icon: 'mdi:fan',
      show_name: true,
    };
  }
}
