import { Season } from '@gamepark/living-forest-duel/Season'
import { DeckLocator } from '@gamepark/react-game'
import { Location } from '@gamepark/rules-api'
import { recruitmentLineLocator } from './RecruitmentLineLocator'

class SeasonAnimalDecksLocator extends DeckLocator {
  getCoordinates(location: Location) {
    return {
      x: location.id === Season.Summer ? -30 : 30,
      y: recruitmentLineLocator.coordinates.y
    }
  }
}

export const seasonAnimalDecksLocator = new SeasonAnimalDecksLocator()