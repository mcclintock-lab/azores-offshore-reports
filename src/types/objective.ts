//// BASE OBJECTIVE ////

export const YES_COUNT_OBJECTIVE = "yes";
export const NO_COUNT_OBJECTIVE = "no";
export const MAYBE_COUNT_OBJECTIVE = "maybe";

export const supportedCounts = [
  YES_COUNT_OBJECTIVE,
  NO_COUNT_OBJECTIVE,
  MAYBE_COUNT_OBJECTIVE,
] as const;

export type SupportedCount = typeof supportedCounts[number];

//// RBCS OBJECTIVE ////

export const rbcsLevels = {
  FULLY_PROTECTED_LEVEL: "Fully Protected Area",
  HIGHLY_PROTECTED_LEVEL: "Highly Protected Area",
  MODERATELY_PROTECTED_LEVEL: "Moderately Protected Area",
  POORLY_PROTECTED_LEVEL: "Poorly Protected Area",
  UNPROTECTED_LEVEL: "Unprotected Area",
};

export const rbcsObjectiveKeys = [
  rbcsLevels.FULLY_PROTECTED_LEVEL,
  rbcsLevels.HIGHLY_PROTECTED_LEVEL,
  rbcsLevels.MODERATELY_PROTECTED_LEVEL,
  rbcsLevels.POORLY_PROTECTED_LEVEL,
  rbcsLevels.UNPROTECTED_LEVEL,
] as const;
export type RbcsObjectiveKey = typeof rbcsObjectiveKeys[number];
export type RbcsObjectiveMap = Record<RbcsObjectiveKey, SupportedCount>;

export interface RbcsObjective {
  /** Value required for objective to be met */
  target: number;
  /** Map of protection levels to whether they count towards objective */
  countsToward: RbcsObjectiveMap;
  shortDesc: string;
}

/**
 * Type guard for checking string is one of supported objective IDs
 * Use in conditional block logic to coerce to type RbcsObjectiveKey within the block
 */
export function isRbcsObjectiveKey(key: string): key is RbcsObjectiveKey {
  return rbcsObjectiveKeys.includes(key as RbcsObjectiveKey);
}
