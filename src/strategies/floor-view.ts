import { ReactiveElement } from 'lit';
import { CUSTOM_ELEMENT_NAME } from '../config';
import { LovelaceViewConfig } from '../lovelace';
import { Hass } from '../hass';

type FloorViewStrategyConfig = {
  floor_id?: string;
};

export class FloorViewStrategy extends ReactiveElement {
  static async generate(
    config: FloorViewStrategyConfig,
    hass: Hass,
  ): Promise<LovelaceViewConfig> {
    const view: LovelaceViewConfig = {
      badges: [],
      cards: [],
    };

    if (!config.floor_id) {
      return view;
    }

    return view;
  }
}

customElements.define(
  `ll-strategy-view-${CUSTOM_ELEMENT_NAME}-floor`,
  FloorViewStrategy,
);
