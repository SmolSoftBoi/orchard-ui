export interface LovelaceConfig {
  background?: string;
  views: LovelaceViewRawConfig[];
}

export type LovelaceViewConfig =
  | LovelaceViewConfig
  | LovelaceStrategyViewConfig;
