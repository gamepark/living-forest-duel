import { LocationType } from '@gamepark/living-forest-duel/material/LocationType'
import { MaterialType } from '@gamepark/living-forest-duel/material/MaterialType'
import { Season } from '@gamepark/living-forest-duel/Season'
import { Locator } from '@gamepark/react-game'
import { clearingLineLocator } from './ClearingLineLocator'
import { clearingCardSpotLocator } from './ClearingCardSpotLocator'
import { fireStockLocator } from './FireStockLocator'
import { treeDecksLocator } from './TreeDecksLocator'
import { recruitmentLineLocator } from './RecruitmentLineLocator'
import { varanDecksLocator } from './VaranDecksLocator'
import { seasonAnimalDecksLocator } from './SeasonAnimalDecksLocator'

export const Locators: Partial<Record<LocationType, Locator<Season, MaterialType, LocationType>>> = {
  [LocationType.ClearingLine]: clearingLineLocator,
  [LocationType.ClearingCardSpot]: clearingCardSpotLocator,
  [LocationType.FireStock]: fireStockLocator,
  [LocationType.TreeDecks]: treeDecksLocator,
  [LocationType.RecruitmentLine]: recruitmentLineLocator,
  [LocationType.VaranDeck]: varanDecksLocator,
  [LocationType.SeasonAnimalDeck]: seasonAnimalDecksLocator
}
