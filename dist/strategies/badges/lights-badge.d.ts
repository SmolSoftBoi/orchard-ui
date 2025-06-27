import { LightEntity } from '@smolpack/hasskit';
import { LovelaceBadgeConfig } from '../../lovelace';
/**
 * Build Lovelace badge configs for light entities.
 */
export declare class LightsBadgeStrategy {
    /**
     * Create a badge that displays a light entity.
     *
     * @param lightEntity - The light to render.
     * @returns The badge configuration.
     */
    static generate(lightEntity: LightEntity): Promise<LovelaceBadgeConfig>;
}
