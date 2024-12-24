export const MAGIC_AREAS_GLOBAL_ENTITY_IDS = {
  climate: 'climate.magic_areas_climate_groups_global_climate_group',
  lights: 'light.magic_areas_light_groups_global',
  media_players:
    'media_player.magic_areas_media_player_groups_global_media_player_group',
};

export const MAGIC_AREAS_FLOOR_ENTITY_IDS = {
  climate: 'climate.magic_areas_climate_groups_${floor_id}_climate_group',
  lights: 'light.magic_areas_light_groups_${floor_id}',
  media_players:
    'media_player.magic_areas_media_player_groups_${floor_id}_media_player_group',
};

export const MAGIC_AREAS_AREA_ENTITY_IDS = {
  lights: {
    all: 'light.magic_areas_light_groups_${area_id}_all_lights',
    overhead: 'light.magic_areas_light_groups_${area_id}_overhead_lights',
    accent: 'light.magic_areas_light_groups_${area_id}_accent_lights',
  },
};
