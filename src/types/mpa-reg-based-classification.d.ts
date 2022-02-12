declare module "mpa-reg-based-classification" {
  type Zone = [string[], string, string, number];
  type MpaClassification = {
    scores: any[];
    index: number;
    indexLabel: string;
  };

  /** Classify a single zone */
  export function classifyZone(
    gearTypes: string[],
    aquaculture: string,
    anchoring: string
  ): number;

  /** Classify a network of zones */
  export function classifyMPA(zones: Zone[]): MpaClassification;

  export namespace constants {
    export const GEAR_TYPES: Record<string, string>;
    export const AQUACULTURE_AND_BOTTOM_EXPLOITATION: Record<string, string>;
    export const BOATING_AND_ANCHORING: Record<string, string>;
  }

  export const scores: Record<number, { label: string; color: string }>;
}
