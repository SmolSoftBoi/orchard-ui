export interface LovelaceConfig {
  background?: string;
  views: LovelaceViewRawConfig[];
}

export type LovelaceViewRawConfig =
  | LovelaceViewConfig
  | LovelaceStrategyViewConfig;

export interface LovelaceViewConfig extends LovelaceBaseViewConfig {
  type?: string;
  badges?: (string | Partial<LovelaceBadgeConfig>)[]; // Badge can be just an entity_id or without type
  cards?: LovelaceCardConfig[];
  sections?: LovelaceSectionRawConfig[];
}

export interface LovelaceBadgeConfig {
  type: string;
  [key: string]: unknown;
  visibility?: Condition[];
}

export type LovelaceSectionRawConfig =
  | LovelaceSectionConfig
  | LovelaceStrategySectionConfig;

export interface LovelaceCardConfig {
  index?: number;
  view_index?: number;
  view_layout?: unknown;
  /** @deprecated Use `grid_options` instead */
  layout_options?: LovelaceLayoutOptions;
  grid_options?: LovelaceGridOptions;
  type: string;
  [key: string]: unknown;
  visibility?: Condition[];
}
