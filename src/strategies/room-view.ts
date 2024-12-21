import { ReactiveElement } from 'lit';
import { CUSTOM_ELEMENT_NAME } from '../config';
import { LovelaceViewConfig } from '../lovelace';
import { Hass } from '../hass';

type RoomViewStrategyConfig = {
  area_id?: string;
};

export class RoomViewStrategy extends ReactiveElement {
  static async generate(
    config: RoomViewStrategyConfig,
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
  `ll-strategy-view-${CUSTOM_ELEMENT_NAME}-room`,
  RoomViewStrategy,
);
