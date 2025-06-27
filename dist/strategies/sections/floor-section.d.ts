import { Floor } from '@smolpack/hasskit';
import { LovelaceCardConfig, LovelaceSectionRawConfig } from '../../lovelace';
/**
 * Build a section summarizing an entire floor.
 */
export declare class FloorSectionStrategy {
    /**
     * Generate a Lovelace section for the provided floor.
     *
     * @param floor - Floor to render.
     * @returns The section configuration.
     */
    static generate(floor: Floor): Promise<LovelaceSectionRawConfig>;
    /**
     * Create all cards belonging to the floor section.
     *
     * @param floor - Floor context.
     * @returns A list of cards.
     */
    static generateCards(floor: Floor): Promise<LovelaceCardConfig[]>;
}
