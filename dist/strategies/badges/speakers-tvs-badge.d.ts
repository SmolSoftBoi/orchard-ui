import { Entity } from '@smolpack/hasskit';
import { LovelaceBadgeConfig } from '../../lovelace';
/**
 * Strategy for generating badges for speakers or televisions.
 */
export declare class SpeakersTvsBadgeStrategy {
    /**
     * Build the badge configuration for media player entities.
     *
     * @param mediaPlayerEntity - The media player to display.
     * @returns The resulting badge configuration.
     */
    static generate(mediaPlayerEntity: Entity): Promise<LovelaceBadgeConfig>;
}
