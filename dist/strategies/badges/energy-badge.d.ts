import { Entity } from '@smolpack/hasskit';
import { LovelaceBadgeConfig } from '../../lovelace';
/**
 * Generate a Lovelace badge from a CO₂ signal entity.
 */
export declare class EnergyBadgeStrategy {
    /**
     * Build the Lovelace badge configuration for energy usage.
     *
     * @param co2SignalEntity - The entity that tracks CO₂ signal.
     * @returns The badge configuration.
     */
    static generate(co2SignalEntity: Entity): Promise<LovelaceBadgeConfig>;
}
