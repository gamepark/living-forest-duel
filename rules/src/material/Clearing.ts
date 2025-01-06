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

export type CardPattern = {
  bonus: Bonus,
  fireValue: number
}

export const clearingProperties: Record<Clearing, CardPattern> = {
  [Clearing.Summer4]: {
    bonus: Bonus.Sanki,
    fireValue: 4
  },
  [Clearing.Summer3]: {
    bonus: Bonus.Recruit,
    fireValue: 3
  },
  [Clearing.Summer2]: {
    bonus: Bonus.Sanki,
    fireValue: 2
  },
  [Clearing.Center]: {
    bonus: Bonus.Plant,
    fireValue: 2
  },
  [Clearing.Winter2]: {
    bonus: Bonus.Sanki,
    fireValue: 2
  },
  [Clearing.Winter3]: {
    bonus: Bonus.Extinguish,
    fireValue: 3
  },
  [Clearing.Winter4]: {
    bonus: Bonus.Sanki,
    fireValue: 4
  }
}

export const clearings = getEnumValues(Clearing)