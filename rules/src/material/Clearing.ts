import { getEnumValues } from "@gamepark/rules-api";
import { Element } from '../Season'

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
  bonus: Element,
  fireValue: number
}

export const clearingProperties: Partial<Record<Clearing, CardPattern>> = {
  [Clearing.Summer4]: {
    bonus: Element.Wind,
    fireValue: 4
  },
  [Clearing.Summer3]: {
    bonus: Element.Sun,
    fireValue: 3
  },
  [Clearing.Summer2]: {
    bonus: Element.Wind,
    fireValue: 2
  },
  [Clearing.Center]: {
    bonus: Element.Plant,
    fireValue: 2
  },
  [Clearing.Winter2]: {
    bonus: Element.Wind,
    fireValue: 2
  },
  [Clearing.Winter3]: {
    bonus: Element.Water,
    fireValue: 3
  },
  [Clearing.Winter4]: {
    bonus: Element.Wind,
    fireValue: 4
  }
}

export const clearings = getEnumValues(Clearing)