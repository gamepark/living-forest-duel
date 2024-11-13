import { OptionsSpec } from '@gamepark/rules-api'
import { TFunction } from 'i18next'
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
 * This object describes all the options a game can have, and will be used by GamePark website to create automatically forms for you game
 * (forms for friendly games, or forms for matchmaking preferences, for instance).
 */
export const LivingForestDuelOptionsSpec: OptionsSpec<LivingForestDuelOptions> = {
  players: {
    id: {
      label: (t: TFunction) => t('Season'),
      values: seasons,
      valueSpec: color => ({ label: t => getPlayerName(color, t) })
    }
  }
}

export function getPlayerName(playerId: Season, t: TFunction) {
  switch (playerId) {
    case Season.Summer:
      return t('Summer')
    case Season.Winter:
      return t('Winter')
  }
}