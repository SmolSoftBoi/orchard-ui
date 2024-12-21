import { ReactiveElement } from 'lit';
import { CUSTOM_ELEMENT_NAME } from '../config';
import { LovelaceViewConfig } from '../lovelace';
import { Hass } from '../hass';

type SpeakersTvsViewStrategyConfig = {};

export class SpeakersTvsViewStrategy extends ReactiveElement {
  static async generate(
    config: SpeakersTvsViewStrategyConfig,
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
  `ll-strategy-view-${CUSTOM_ELEMENT_NAME}-speakers-tvs`,
  SpeakersTvsViewStrategy,
);
