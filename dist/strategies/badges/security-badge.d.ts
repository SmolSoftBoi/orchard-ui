import { Entity } from '@smolpack/hasskit';
import { LovelaceBadgeConfig } from '../../lovelace';
/**
 * Generate badges for security related entities.
 */
export declare class SecurityBadgeStrategy {
    /**
     * Build the badge configuration for a lock or alarm entity.
     *
     * @param securityEntity - The security entity to display.
     * @returns The generated badge configuration.
     */
    static generate(securityEntity: Entity): Promise<LovelaceBadgeConfig>;
}
