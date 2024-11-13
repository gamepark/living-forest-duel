import { getEnumValues } from '@gamepark/rules-api'

export enum Season {
  Summer = 1, Winter
}

export const seasons = getEnumValues(Season)
