import { TFunction, OptionsSpecV2 } from '@gamepark/rules-api'
import { Season, seasons } from './Season'

/**
 * This is the options for each player in the game.
 */
type PlayerOptions = { id: Season }

/**
 * This is the type of object that the game receives when a new game is started.
 * The first generic parameter, "{}", can be changed to include game options like variants or expansions.
 */
export type LivingForestDuelOptions = {
  players: PlayerOptions[]
}

/**
 * The option space of living-forest-duel: structure only.
 *
 * Labels live in the game's presentation document, published beside its translations at
 * `/options/<locale>.json` and keyed by convention. Subscription and competitive gates live in
 * the platform database, so they can change without releasing the game again.
 */
export const LivingForestDuelOptionsSpecV2: OptionsSpecV2 = {
  specVersion: 2,
  players: { min: 2, max: 2 },
  identities: { values: seasons }
}

export function getPlayerName(playerId: Season, t: TFunction) {
  switch (playerId) {
    case Season.Summer:
      return t('Summer')
    case Season.Winter:
      return t('Winter')
  }
}