import { HassEntity } from 'home-assistant-js-websocket';
import {
  Hass,
  HassAreaRegistryEntry,
  HassDeviceRegistryEntry,
  HassEntityRegistryDisplayEntry,
  HassFloorRegistryEntry,
} from './hass';
import {
  MAGIC_AREAS_AREA_ENTITY_IDS,
  MAGIC_AREAS_FLOOR_ENTITY_IDS,
  MAGIC_AREAS_GLOBAL_ENTITY_IDS,
} from './magic-areas';
import { WEATHERKIT_PLATFORM } from './weatherkit';

export type HomeConfig = {
  rooms?: HomeConfigRoom[];
};

export type HomeConfigRoom = {
  id: string;
};

export class Home {
  readonly hass: Hass;

  config: HomeConfig;

  constructor(hass: Hass, config?: HomeConfig) {
    this.hass = hass;
    this.config = config || {};
  }

  get floors(): Floor[] {
    return Object.values(this.hass.floors).map(
      (floor) => new Floor(this, floor.floor_id)
    );
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
}

export class Floor {
  readonly home: Home;
  readonly hassFloor: HassFloorRegistryEntry;

  constructor(home: Home, floorId: string) {
    this.home = home;
    this.hassFloor = this.home.hass.floors[floorId];
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

  get id(): string {
    return this.hassFloor.floor_id;
  }

  get name(): string {
    return this.hassFloor.name;
  }

  get icon(): string | void {
    return this.hassFloor.icon ? this.hassFloor.icon : undefined;
  }
}

export class Room {
  readonly home: Home;
  readonly hassArea: HassAreaRegistryEntry;

  constructor(home: Home, areaId: string) {
    this.home = home;
    this.hassArea = this.home.hass.areas[areaId];
  }

  get id(): string {
    return this.hassArea.area_id;
  }

  get name(): string {
    return this.hassArea.name;
  }

  get accessories(): Accessory[] {
    return Object.values(this.home.hass.devices)
      .filter((device) => device.area_id === this.hassArea.area_id)
      .map((device) => new Accessory(this.home, device.id));
  }

  get services(): Service[] {
    let services: Service[] = [];

    for (const accessory of this.accessories) {
      services.push(...accessory.services);
    }

    services.push(
      ...Object.values(this.home.hass.entities)
        .filter((entity) => entity.area_id === this.hassArea.area_id)
        .map((entity) => new Service(this.home, entity.entity_id))
    );

    services = services.filter(
      (service) =>
        service.hassState.attributes.is_hue_group === undefined ||
        service.hassState.attributes.is_hue_group === false
    );

    return services;
  }

  get automationServices(): Service[] {
    return this.services.filter((service) => service.domain === 'automation');
  }

  get climateServices(): Service[] {
    return this.services.filter((service) => service.domain === 'climate');
  }

  get climateService(): Service | void {
    const magicService = this.home.climateServices.find(
      (service) =>
        service.id ===
        MAGIC_AREAS_AREA_ENTITY_IDS.climate.replace('${area_id}', this.id)
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

  get lightServiceGroups(): Service[] {
    const magicLights = [];

    const overheadLights = this.home.lightServices.find(
      (service) =>
        service.id ===
        MAGIC_AREAS_AREA_ENTITY_IDS.lights.overhead.replace(
          '${area_id}',
          this.id
        )
    );

    if (overheadLights) {
      magicLights.push(overheadLights);
    }

    const accentLights = this.home.lightServices.find(
      (service) =>
        service.id ===
        MAGIC_AREAS_AREA_ENTITY_IDS.lights.accent.replace('${area_id}', this.id)
    );

    if (accentLights) {
      magicLights.push(accentLights);
    }

    if (magicLights.length > 0) {
      return magicLights;
    }

    if (this.lightServices.length === 1) {
      return this.lightServices;
    }

    return [];
  }

  get lightService(): Service | void {
    const magicService = this.home.lightServices.find(
      (service) =>
        service.id ===
        MAGIC_AREAS_AREA_ENTITY_IDS.lights.all.replace('${area_id}', this.id)
    );

    if (magicService) {
      return magicService;
    }

    if (this.lightServiceGroups.length > 0) {
      return this.lightServiceGroups[0];
    }

    if (this.services.length === 1) {
      return this.services[0];
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

  get speakerTvServices(): Service[] {
    return this.services.filter((service) => service.domain === 'media_player');
  }

  get speakerTvService(): Service | void {
    const magicService = this.home.speakersTvsServices.find(
      (service) =>
        service.id ===
        MAGIC_AREAS_AREA_ENTITY_IDS.media_players.replace('${area_id}', this.id)
    );

    if (magicService) {
      return magicService;
    }

    if (this.speakerTvServices.length === 1) {
      return this.speakerTvServices[0];
    }
  }
}

export class Accessory {
  readonly home: Home;
  readonly hassDevice: HassDeviceRegistryEntry;

  constructor(home: Home, deviceId: string) {
    this.home = home;
    this.hassDevice = this.home.hass.devices[deviceId];
  }

  get services(): Service[] {
    return Object.values(this.home.hass.entities)
      .filter((entity) => entity.device_id === this.hassDevice.id)
      .map((entity) => new Service(this.home, entity.entity_id));
  }

  get lightServices(): Service[] {
    return this.services.filter((service) => service.domain === 'light');
  }
}

export class Service {
  readonly home: Home;
  readonly hassEntity: HassEntityRegistryDisplayEntry;
  readonly hassState: HassEntity;

  constructor(home: Home, entityId: string) {
    this.home = home;
    this.hassEntity = this.home.hass.entities[entityId];
    this.hassState = this.home.hass.states[entityId];
  }

  get id(): string {
    return this.hassEntity.entity_id;
  }

  get name(): string | void {
    return this.hassEntity.name;
  }

  get domain(): string {
    return this.hassEntity.entity_id.split('.')[0];
  }

  get platform(): string | void {
    return this.hassEntity.platform;
  }
}
