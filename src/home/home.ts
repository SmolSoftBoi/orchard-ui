import { Hass } from '../hass';
import { MAGIC_AREAS_GLOBAL_ENTITY_IDS } from '../magic-areas';
import { WEATHERKIT_PLATFORM } from '../weatherkit';
import Accessory from './accessory';
import Floor from './floor';
import Room from './room';
import { ServiceGroup } from './service';
import Service, { ServiceTypes } from './service/service';

export type HomeConfig = {
  rooms?: HomeConfigRoom[];
};

export type HomeConfigRoom = {
  id: string;
};

export interface HomeInterface {
  name: string;
  rooms: Room[];
  floors: Floor[];
  accessories: Accessory[];
  servicesWithTypes: (serviceTypes: string[]) => Service[];
  serviceGroups: ServiceGroup[];
}

export default class Home implements HomeInterface {
  readonly hass: Hass;

  config: HomeConfig;

  constructor(hass: Hass, config?: HomeConfig) {
    this.hass = hass;
    this.config = config || {};
  }

  get name(): string {
    return this.hass.config.location_name;
  }

  get rooms(): Room[] {
    const rooms = [];

    for (const floor of this.floors) {
      rooms.push(...floor.rooms);
    }

    return rooms;
  }

  get floors(): Floor[] {
    return Object.values(this.hass.floors).map(
      (floor) => new Floor(this, floor.floor_id)
    );
  }

  get accessories(): Accessory[] {
    const accessories = [];

    for (const room of this.rooms) {
      accessories.push(...room.accessories);
    }

    return accessories;
  }

  servicesWithTypes(serviceTypes: ServiceTypes[]) {
    return [];
  }

  get serviceGroups(): ServiceGroup[] {
    return [];
  }

  floor(floorId: string): Floor | void {
    const hassFloor = this.hass.floors[floorId];

    if (hassFloor) {
      return new Floor(this, floorId);
    }
  }

  get services(): Service[] {
    return Object.values(this.hass.entities).map(
      (entity) => new Service(this, entity.entity_id)
    );
  }

  get weatherService(): Service | void {
    const weatherServices = this.services.filter(
      (service) => service.domain === 'weather'
    );

    if (weatherServices.length === 1) {
      return weatherServices[0];
    }

    if (weatherServices.length > 1) {
      const weatherKitService = weatherServices.find(
        (service) => service.platform === WEATHERKIT_PLATFORM
      );

      if (weatherKitService) {
        return weatherKitService;
      }

      return weatherServices[0];
    }
  }

  get climateServices(): Service[] {
    return this.services.filter((service) => service.domain === 'climate');
  }

  get climateService(): Service | void {
    const magicService = this.services.find(
      (service) => service.id === MAGIC_AREAS_GLOBAL_ENTITY_IDS.climate
    );

    if (magicService) {
      return magicService;
    }

    if (this.climateServices.length === 1) {
      return this.climateServices[0];
    }
  }

  get lightServices(): Service[] {
    return this.services.filter((service) => service.domain === 'light');
  }

  get lightService(): Service | void {
    const magicService = this.services.find(
      (service) => service.id === MAGIC_AREAS_GLOBAL_ENTITY_IDS.lights
    );

    if (magicService) {
      return magicService;
    }

    if (this.lightServices.length === 1) {
      return this.lightServices[0];
    }
  }

  get securityServices(): Service[] {
    return this.services.filter((service) => service.domain === 'lock');
  }

  get securityService(): Service | void {
    if (this.securityServices.length === 1) {
      return this.securityServices[0];
    }
  }

  get speakersTvsServices(): Service[] {
    return this.services.filter((service) => service.domain === 'media_player');
  }

  get speakersTvsService(): Service | void {
    const magicService = this.services.find(
      (service) => service.id === MAGIC_AREAS_GLOBAL_ENTITY_IDS.media_players
    );

    if (magicService) {
      return magicService;
    }

    if (this.speakersTvsServices.length === 1) {
      return this.speakersTvsServices[0];
    }
  }

  get wasteServices(): Service[] {
    return this.services
      .filter((service) => service.domain === 'calendar')
      .filter((service) => service.id.includes('waste'));
  }

  get wasteService(): Service | void {
    if (this.wasteServices.length === 1) {
      return this.wasteServices[0];
    }
  }
}
