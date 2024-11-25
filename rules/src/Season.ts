import { Direction, getEnumValues } from '@gamepark/rules-api'

export enum Season {
  Summer = 1, Winter
}

export enum Element {
  Sun = 1,
  Water,
  Plant,
  Wind
}

export const CardinalLocations: Record<Direction, { x: number; y: number }> = {
  [Direction.North]: { x: 0, y: -1 },
  [Direction.East]: { x: 1, y: 0 },
  [Direction.South]: { x: 0, y: 1 },
  [Direction.West]: { x: -1, y: 0 }
}

export const seasons = getEnumValues(Season)
export const elements = getEnumValues(Element)
export const getOpponentSeason = (player: number) => player === Season.Summer ? Season.Winter : Season.Summer