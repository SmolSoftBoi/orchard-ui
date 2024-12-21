import { ReactiveElement } from 'lit';
import { CUSTOM_ELEMENT_NAME } from '../config';
import { LovelaceViewConfig } from '../lovelace';
import { Hass } from '../hass';

type LightsViewStrategyConfig = {};

export class LightsViewStrategy extends ReactiveElement {
  static async generate(
    config: LightsViewStrategyConfig,
    hass: Hass,
  ): Promise<LovelaceViewConfig> {
    const view: LovelaceViewConfig = {
      badges: [],
      cards: [],
    };

    return view;
  }
}

customElements.define(
  `ll-strategy-view-${CUSTOM_ELEMENT_NAME}-lights`,
  LightsViewStrategy,
);
