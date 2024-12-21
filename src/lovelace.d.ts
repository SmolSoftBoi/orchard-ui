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
  [key: string]: any;
  visibility?: Condition[];
}

export type LovelaceSectionRawConfig =
  | LovelaceSectionConfig
  | LovelaceStrategySectionConfig;
