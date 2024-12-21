import { Hass, HassEntityRegistryDisplayEntry } from '../hass';
import { LovelaceBadgeConfig } from '../lovelace';

export type WeatherBadgeStrategyConfig = {};

export class WeatherBadgeStrategy {
  static async generate(
    config: WeatherBadgeStrategyConfig,
    hass: Hass,
  ): Promise<LovelaceBadgeConfig | undefined> {
    const badge: LovelaceBadgeConfig = {
      type: 'entity',
      entity: this.primaryEntity(hass)?.entity_id,
      name: 'Weather',
      show_name: true,
      state_content: ['state', 'temperature'],
    };

    return badge;
  }

  static primaryEntity(hass: Hass): HassEntityRegistryDisplayEntry | undefined {
    const weatherEntities = Object.values(hass.entities).filter((entity) =>
      entity.entity_id.startsWith('weather.'),
    );

    console.log(weatherEntities);

    const appleWeatherEntity = weatherEntities.find(
      (entity) => entity.platform === 'weatherkit',
    );

    if (appleWeatherEntity) {
      return appleWeatherEntity;
    }

    if (weatherEntities.length > 0) {
      return weatherEntities[0];
    }
  }
}
