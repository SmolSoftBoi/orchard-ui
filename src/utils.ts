export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

export type ConfigAreas = {
  areas: ConfigArea[];
};

export type ConfigArea = {
  id: string;
};

export function createConfigAreas(
  partialConfig: DeepPartial<ConfigAreas>
): ConfigAreas {
  const config: ConfigAreas = {
    areas: [],
  };

  if (partialConfig.areas) {
    for (const area of partialConfig.areas) {
      if (area && area.id) {
        config.areas.push({
          id: area.id,
        });
      }
    }
  }

  return config;
}
