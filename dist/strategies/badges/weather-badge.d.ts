import { Entity } from '@smolpack/hasskit';
import { LovelaceBadgeConfig } from '../../lovelace';
/**
 * Build a weather badge configuration.
 */
export declare class WeatherBadgeStrategy {
    /**
     * Generate a badge representing the weather entity.
     *
     * @param weatherEntity - The weather entity to display.
     * @returns The badge configuration.
     */
    static generate(weatherEntity: Entity): Promise<LovelaceBadgeConfig>;
}
