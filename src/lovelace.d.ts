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
  visibility?: LovelaceCondition[];
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
  visibility?: LovelaceCondition[];
}

export type LovelaceCondition =
  | LovelaceNumericStateCondition
  | LovelaceStateCondition
  | LovelaceScreenCondition
  | LovelaceUserCondition
  | LovelaceOrCondition
  | LovelaceAndCondition;

export interface LovelaceNumericStateCondition extends LovelaceBaseCondition {
  condition: 'numeric_state';
  entity?: string;
  below?: string | number;
  above?: string | number;
}

export interface LovelaceStateCondition extends LovelaceBaseCondition {
  condition: 'state';
  entity?: string;
  state?: string | string[];
  state_not?: string | string[];
}

export interface LovelaceScreenCondition extends LovelaceBaseCondition {
  condition: 'screen';
  media_query?: string;
}

export interface LovelaceUserCondition extends LovelaceBaseCondition {
  condition: 'user';
  users?: string[];
}

export interface LovelaceOrCondition extends LovelaceBaseCondition {
  condition: 'or';
  conditions?: LovelaceCondition[];
}

export interface LovelaceAndCondition extends LovelaceBaseCondition {
  condition: 'and';
  conditions?: LovelaceCondition[];
}
