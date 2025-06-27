import { Entity } from '@smolpack/hasskit';
import { LovelaceCardConfig } from '../../lovelace';
/**
 * Build tiles for media player control.
 */
export declare class SpeakerTvCardStrategy {
    /**
     * Create a tile for a speaker or TV entity.
     *
     * @param mediaPlayerEntity - The media player to render.
     * @returns The card configuration.
     */
    static generate(mediaPlayerEntity: Entity): Promise<LovelaceCardConfig>;
}
