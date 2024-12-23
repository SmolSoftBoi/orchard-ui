import type {
  HassConfig,
  HassEntities,
  HassServices,
} from 'home-assistant-js-websocket';

export interface Hass {
  auth: Auth & { external?: HassExternalMessaging };
  connection: HassConnection;
  connected: boolean;
  states: HassEntities;
  entities: { [id: string]: HassEntityRegistryDisplayEntry };
  devices: { [id: string]: HassDeviceRegistryEntry };
  areas: { [id: string]: HassAreaRegistryEntry };
  floors: { [id: string]: HassFloorRegistryEntry };
  services: HassServices;
  config: HassConfig;
  themes: HassThemes;
  selectedTheme: HassThemeSettings | null;
  panels: Panels;
  panelUrl: string;
  // i18n
  // current effective language in that order:
  //   - backend saved user selected language
  //   - language in local app storage
  //   - browser language
  //   - english (en)
  language: string;
  // local stored language, keep that name for backward compatibility
  selectedLanguage: string | null;
  locale: HassFrontendLocaleData;
  resources: HassResources;
  localize: HassLocalizeFunc;
  translationMetadata: HassTranslationMetadata;
  suspendWhenHidden: boolean;
  enableShortcuts: boolean;
  vibrate: boolean;
  debugConnection: boolean;
  dockedSidebar: 'docked' | 'always_hidden' | 'auto';
  defaultPanel: string;
  moreInfoEntityId: string | null;
  user?: HassCurrentUser;
  userData?: HassCoreFrontendUserData | null;
  hassUrl(path?): string;
  callService(
    domain: HassServiceCallRequest['domain'],
    service: HassServiceCallRequest['service'],
    serviceData?: HassServiceCallRequest['serviceData'],
    target?: HassServiceCallRequest['target'],
    notifyOnError?: boolean,
    returnResponse?: boolean
  ): Promise<HassServiceCallResponse>;
  callApi<T>(
    method: 'GET' | 'POST' | 'PUT' | 'DELETE',
    path: string,
    parameters?: Record<string, unknown>,
    headers?: Record<string, string>
  ): Promise<T>;
  callApiRaw( // introduced in 2024.11
    method: 'GET' | 'POST' | 'PUT' | 'DELETE',
    path: string,
    parameters?: Record<string, unknown>,
    headers?: Record<string, string>,
    signal?: AbortSignal
  ): Promise<Response>;
  fetchWithAuth(
    path: string,
    init?: Record<string, unknown>
  ): Promise<Response>;
  sendWS(msg: MessageBase): void;
  callWS<T>(msg: MessageBase): Promise<T>;
  loadBackendTranslation(
    category: Parameters<typeof getHassTranslations>[2],
    integrations?: Parameters<typeof getHassTranslations>[3],
    configFlow?: Parameters<typeof getHassTranslations>[4]
  ): Promise<LocalizeFunc>;
  loadFragmentTranslation(
    fragment: string
  ): Promise<HassLocalizeFunc | undefined>;
  formatEntityState(stateObj: HassEntity, state?: string): string;
  formatEntityAttributeValue(
    stateObj: HassEntity,
    attribute: string,
    value?: unknown
  ): string;
  formatEntityAttributeName(stateObj: HassEntity, attribute: string): string;
}

export interface HassEntityRegistryDisplayEntry {
  entity_id: string;
  name?: string;
  icon?: string;
  device_id?: string;
  area_id?: string;
  labels: string[];
  hidden?: boolean;
  entity_category?: HassEntityCategory;
  translation_key?: string;
  platform?: string;
  display_precision?: number;
}

export interface HassDeviceRegistryEntry extends HassRegistryEntry {
  id: string;
  config_entries: string[];
  connections: Array<[string, string]>;
  identifiers: Array<[string, string]>;
  manufacturer: string | null;
  model: string | null;
  model_id: string | null;
  name: string | null;
  labels: string[];
  sw_version: string | null;
  hw_version: string | null;
  serial_number: string | null;
  via_device_id: string | null;
  area_id: string | null;
  name_by_user: string | null;
  entry_type: 'service' | null;
  disabled_by: 'user' | 'integration' | 'config_entry' | null;
  configuration_url: string | null;
  primary_config_entry: string | null;
}

export interface HassAreaRegistryEntry extends RegistryEntry {
  area_id: string;
  floor_id: string | null;
  name: string;
  picture: string | null;
  icon: string | null;
  labels: string[];
  aliases: string[];
}

export interface HassFloorRegistryEntry extends RegistryEntry {
  floor_id: string;
  name: string;
  level: number | null;
  icon: string | null;
  aliases: string[];
}

export type HassCondition =
  | NumericStateCondition
  | StateCondition
  | ScreenCondition
  | UserCondition
  | OrCondition
  | AndCondition;
