import { HassFloorRegistryEntry } from '../hass';
import { MAGIC_AREAS_FLOOR_ENTITY_IDS } from '../magic-areas';
import Home from './home';
import Room, { RoomInterface } from './room';
import Service from './service/service';

export interface ZoneInterface {
  name: string;
  id: string;
  rooms: RoomInterface[];
}

export default class Zone {
  readonly home: Home;
  readonly hassFloor: HassFloorRegistryEntry;

  constructor(home: Home, floorId: string) {
    this.home = home;
    this.hassFloor = this.home.hass.floors[floorId];
  }

  get name(): string {
    return this.hassFloor.name;
  }

  get id(): string {
    return this.hassFloor.floor_id;
  }

  get rooms(): Room[] {
    return Object.values(this.home.hass.areas)
      .filter((area) => area.floor_id === this.hassFloor.floor_id)
      .map((area) => new Room(this.home, area.area_id))
      .sort(this.compareRooms.bind(this));
  }

  private compareRooms(roomA: Room, roomB: Room): number {
    const rooms = this.home.config.rooms || [];
    const indexA = rooms.findIndex((r) => r.id === roomA.id);
    const indexB = rooms.findIndex((r) => r.id === roomB.id);

    if (indexA < 0 && indexB < 0) {
      return roomA.name.localeCompare(roomB.name);
    }

    if (indexA < 0) {
      return 1;
    }

    if (indexB < 0) {
      return -1;
    }
    return indexA - indexB;
  }

  get services(): Service[] {
    const services: Service[] = [];

    for (const room of this.rooms) {
      services.push(...room.services);
    }

    return services;
  }

  get climateServices(): Service[] {
    return this.services.filter((service) => service.domain === 'climate');
  }

  get climateService(): Service | void {
    const magicService = this.home.climateServices.find(
      (service) =>
        service.id ===
        MAGIC_AREAS_FLOOR_ENTITY_IDS.climate.replace('${floor_id}', this.id)
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
    const magicService = this.home.lightServices.find(
      (service) =>
        service.id ===
        MAGIC_AREAS_FLOOR_ENTITY_IDS.lights.replace('${floor_id}', this.id)
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
    const magicService = this.home.speakersTvsServices.find(
      (service) =>
        service.id ===
        MAGIC_AREAS_FLOOR_ENTITY_IDS.media_players.replace(
          '${floor_id}',
          this.id
        )
    );

    if (magicService) {
      return magicService;
    }

    if (this.speakersTvsServices.length === 1) {
      return this.speakersTvsServices[0];
    }
  }

  get icon(): string | void {
    return this.hassFloor.icon ? this.hassFloor.icon : undefined;
  }
}
