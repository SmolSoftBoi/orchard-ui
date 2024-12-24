import { Service } from '../home';
import { LovelaceBadgeConfig } from '../lovelace';
export class SecurityBadgeStrategy {
  static async generate(service: Service): Promise<LovelaceBadgeConfig> {
    return {
      type: 'entity',
      entity: service.id,
      name: 'Security',
      icon: 'mdi:lock',
      show_name: true,
      state_content: ['state'],
    };
  }
}
