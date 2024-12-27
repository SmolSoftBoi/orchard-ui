import { HassEntity } from 'home-assistant-js-websocket';
import { HassEntityRegistryDisplayEntry } from '../../hass';
import Home from '../home';
import { CharacteristicInterface } from '../../charactaristic';

export type ServiceTypes = string;

export interface ServiceInterface {
  characteristics: CharacteristicInterface[];
  name: string;
  id: string;
}

export default class Service {
  readonly home: Home;
  readonly hassEntity: HassEntityRegistryDisplayEntry;
  readonly hassState: HassEntity;

  constructor(home: Home, entityId: string) {
    this.home = home;
    this.hassEntity = this.home.hass.entities[entityId];
    this.hassState = this.home.hass.states[entityId];
  }

  get characteristics(): CharacteristicInterface[] {
    return [];
  }

  get name(): string | void {
    return this.hassEntity.name;
  }

  get id(): string {
    return this.hassEntity.entity_id;
  }

  get domain(): string {
    return this.hassEntity.entity_id.split('.')[0];
  }

  get platform(): string | void {
    return this.hassEntity.platform;
  }
}
