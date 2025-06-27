import { Entity } from '@smolpack/hasskit';
import { LovelaceBadgeConfig } from '../../lovelace';
/**
 * Display upcoming waste collection information.
 */
export declare class WasteBadgeStrategy {
    /**
     * Generate configuration for a waste entity badge.
     *
     * @param wasteEntity - The waste schedule entity.
     * @returns The badge configuration.
     */
    static generate(wasteEntity: Entity): Promise<LovelaceBadgeConfig>;
}
