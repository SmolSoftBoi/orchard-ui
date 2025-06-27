import { Entity } from '@smolpack/hasskit';
import { LovelaceBadgeConfig } from '../../lovelace';
/**
 * Build a badge for climate entities like thermostats or fans.
 */
export declare class ClimateBadgeStrategy {
    /**
     * Create the Lovelace configuration for a climate badge.
     *
     * @param climateEntity - The entity representing the climate device.
     * @returns The badge configuration.
     */
    static generate(climateEntity: Entity): Promise<LovelaceBadgeConfig>;
}
