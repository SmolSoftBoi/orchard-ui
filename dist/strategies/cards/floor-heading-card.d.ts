import { Floor } from '@smolpack/hasskit';
import { LovelaceBadgeConfig, LovelaceCardConfig } from '../../lovelace';
/**
 * Strategy for heading cards that introduce a floor.
 */
export declare class FloorHeadingCardStrategy {
    /**
     * Generate the heading card for a floor.
     *
     * @param floor - The floor to represent.
     * @returns The card configuration.
     */
    static generate(floor: Floor): Promise<LovelaceCardConfig>;
    /**
     * Build floor level badges for the heading card.
     *
     * @param floor - The floor to render.
     * @returns List of badges to show.
     */
    static generateBadges(floor: Floor): Promise<LovelaceBadgeConfig[]>;
}
