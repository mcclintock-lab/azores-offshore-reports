// Move to rbcs types
export const FULLY_PROTECTED_LEVEL = "Fully Protected Area";
export const HIGHLY_PROTECTED_LEVEL = "Highly Protected Area";
export const MODERATELY_PROTECTED_LEVEL = "Moderately Protected Area";
export const POORLY_PROTECTED_LEVEL = "Poorly Protected Area";
export const UNPROTECTED_LEVEL = "Unprotected Area";

enum ProtectionLevels {
  FULLY_PROTECTED = "Fully Protected Area",
  HIGHLY_PROTECTED = "Highly Protected Area",
  MODERATELY_PROTECTED = "Moderately Protected Area",
  POORLY_PROTECTED = "Poorly Protected Area",
  UNPROTECED = "Unprotected Area",
}

export const rbcsMpaProtectionLevels = [
  FULLY_PROTECTED_LEVEL,
  HIGHLY_PROTECTED_LEVEL,
  MODERATELY_PROTECTED_LEVEL,
  POORLY_PROTECTED_LEVEL,
  UNPROTECTED_LEVEL,
] as const;

export type RbcsMpaProtectionLevel = typeof rbcsMpaProtectionLevels[number];

//// BASE OBJECTIVE ////

export const YES_COUNT_OBJECTIVE = "yes";
export const NO_COUNT_OBJECTIVE = "no";
export const MAYBE_COUNT_OBJECTIVE = "maybe";

export const objectiveCountsAnswers = [
  YES_COUNT_OBJECTIVE,
  NO_COUNT_OBJECTIVE,
  MAYBE_COUNT_OBJECTIVE,
] as const;

export type ObjectiveCountsAnswer = typeof objectiveCountsAnswers[number];

//// RBCS OBJECTIVE ////

export type RbcsObjectiveMap = Record<
  RbcsMpaProtectionLevel,
  ObjectiveCountsAnswer
>;
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
export function isRbcsProtectionLevel(
  key: string
): key is RbcsMpaProtectionLevel {
  return rbcsMpaProtectionLevels.includes(key as RbcsMpaProtectionLevel);
}
