import { Accessory } from './accessory';
import { HassAreaRegistryEntry } from '../hass';
import { Home } from './home';
import { MAGIC_AREAS_AREA_ENTITY_IDS } from '../magic-areas';
import { Service } from './service';

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
