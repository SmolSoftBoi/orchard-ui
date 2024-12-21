import { ReactiveElement } from 'lit';
import { CUSTOM_ELEMENT_NAME } from '../config';
import { LovelaceViewConfig } from '../lovelace';
import { Hass } from '../hass';

type ClimateViewStrategyConfig = {};

export class ClimateViewStrategy extends ReactiveElement {
  static async generate(
    config: ClimateViewStrategyConfig,
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
  `ll-strategy-view-${CUSTOM_ELEMENT_NAME}-climate`,
  ClimateViewStrategy,
);
