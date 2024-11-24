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

export const clearingProperties: Partial<Record<Clearing, Element>> = {
  [Clearing.Summer4]: Element.Wind,
  [Clearing.Summer3]: Element.Sun,
  [Clearing.Summer2]: Element.Wind,
  [Clearing.Center]: Element.Plant,
  [Clearing.Winter2]: Element.Wind,
  [Clearing.Winter3]: Element.Water,
  [Clearing.Winter4]: Element.Wind
}

export const clearings = getEnumValues(Clearing)