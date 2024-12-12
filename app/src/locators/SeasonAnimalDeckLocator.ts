import { Season } from '@gamepark/living-forest-duel/Season'
import { DeckLocator } from '@gamepark/react-game'
import { Location } from '@gamepark/rules-api'
import { recruitmentLineLocator } from './RecruitmentLineLocator'

class SeasonAnimalDeckLocator extends DeckLocator {
  getCoordinates(location: Location) {
    return {
      x: location.player === Season.Summer ? -30 : 30,
      y: recruitmentLineLocator.coordinates.y
    }
  }
}

export const seasonAnimalDeckLocator = new SeasonAnimalDeckLocator()