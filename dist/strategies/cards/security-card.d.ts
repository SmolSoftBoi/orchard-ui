import { Entity } from '@smolpack/hasskit';
import { LovelaceCardConfig } from '../../lovelace';
/**
 * Build a tile for lock entities.
 */
export declare class SecurityCardStrategy {
    /**
     * Create a card for a security lock.
     *
     * @param lockEntity - The lock or alarm entity.
     * @returns The card configuration.
     */
    static generate(lockEntity: Entity): Promise<LovelaceCardConfig>;
}
