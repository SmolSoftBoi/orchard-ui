import { LovelaceBadgeConfig } from '../lovelace';
import { Service } from '../service';
export class LightsBadgeStrategy {
  static async generate(service: Service): Promise<LovelaceBadgeConfig> {
    return {
      type: 'entity',
      entity: service.id,
      name: 'Lights',
      icon: 'mdi:lightbulb-group',
      show_name: true,
      state_content: ['state'],
    };
  }
}
