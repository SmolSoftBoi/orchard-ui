import { HassDeviceRegistryEntry } from '../hass';
import Home from './home';
import Service from './service/service';

export default class Accessory {
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
