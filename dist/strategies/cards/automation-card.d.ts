import { AutomationEntity } from '@smolpack/hasskit';
import { LovelaceCardConfig } from '../../lovelace';
/**
 * Display automations in a tile.
 */
export declare class AutomationCardStrategy {
    /**
     * Generate the automation tile configuration.
     *
     * @param automationEntity - The automation to show.
     * @returns The Lovelace card configuration.
     */
    static generate(automationEntity: AutomationEntity): Promise<LovelaceCardConfig>;
}
