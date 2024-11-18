import { getEnumValues } from '@gamepark/rules-api'

export enum Season {
  Summer = 1, Winter
}

export enum Element {
  Sun = 1,
  Water,
  Plant,
  Wind
}

export const seasons = getEnumValues(Season)
export const elements = getEnumValues(Element)
