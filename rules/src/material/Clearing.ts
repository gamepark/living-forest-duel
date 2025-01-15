import { getEnumValues } from '@gamepark/rules-api'
import { Bonus } from './Bonus'

export enum Clearing {
  Summer4 = -3,
  Summer3,
  Summer2,
  Center,
  Winter2,
  Winter3,
  Winter4
}

export const getClearingFireValue = (clearing: Clearing) => Math.max(2, Math.abs(clearing) + 1)

export function getClearingBonus(clearing: Clearing) {
  switch (Math.abs(clearing)) {
    case 0:
      return Bonus.Plant
    case 1:
      return Bonus.Recruit
    case 2:
      return Bonus.Extinguish
    default:
      return Bonus.Sanki
  }
}

export const clearings = getEnumValues(Clearing)