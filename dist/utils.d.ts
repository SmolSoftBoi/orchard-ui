export type DeepPartial<T> = {
    [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};
export type ConfigAreas = {
    areas: ConfigArea[];
};
export type ConfigArea = {
    id: string;
};
export declare function createConfigAreas(partialConfig: DeepPartial<ConfigAreas>): ConfigAreas;
