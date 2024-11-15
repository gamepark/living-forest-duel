import { getEnumValues } from "@gamepark/rules-api";

export enum Clearing {
  Summer4 = -3,
  Summer3,
  Summer2,
  Center,
  Winter2,
  Winter3,
  Winter4
}

export const clearings = getEnumValues(Clearing)