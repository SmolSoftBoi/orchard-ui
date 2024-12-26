import { Service } from './home';

export interface CharacteristicInterface {
  description: string;
}

export default class Characteristic {
  readonly service: Service;
  readonly attributeName: string;

  constructor(service: Service, attributeName: string) {
    this.service = service;
    this.attributeName = attributeName;
  }

  get description(): string {
    return this.service.home.hass.formatEntityAttributeName(
      this.service.hassState,
      this.attributeName
    );
  }
}
