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
import { playerTreesAreaLocator } from './PlayerTreesAreaLocator'
import { playerActionSupplyLocator } from './PlayerActionSupplyLocator'
import { onibiCardLocator } from './OnibiCardLocator'
import { sankiDeckLocator } from './SankiDeckLocator'
import { sharedHelpLineLocator } from './SharedHelpLineLocator'
import { sharedDeckLocator } from './SharedDeckLocator'
import { treeTokenLocator } from './TreeTokenLocator'
import { personalHelpLineLocator } from './PersonalHelpLineLocator'
import { actionLocator } from './ActionLocator'

export const Locators: Partial<Record<LocationType, Locator<Season, MaterialType, LocationType>>> = {
  [LocationType.ClearingLine]: clearingLineLocator,
  [LocationType.ClearingCardSpot]: clearingCardSpotLocator,
  [LocationType.FireStock]: fireStockLocator,
  [LocationType.TreeDecks]: treeDecksLocator,
  [LocationType.RecruitmentLine]: recruitmentLineLocator,
  [LocationType.VaranDeck]: varanDecksLocator,
  [LocationType.SeasonAnimalDeck]: seasonAnimalDecksLocator,
  [LocationType.PlayerTreesArea]: playerTreesAreaLocator,
  [LocationType.PlayerActionSupply]: playerActionSupplyLocator,
  [LocationType.OnibiCard]: onibiCardLocator,
  [LocationType.SankiDeck]: sankiDeckLocator,
  [LocationType.SharedHelpLine]: sharedHelpLineLocator,
  [LocationType.SharedDeck]: sharedDeckLocator,
  [LocationType.TreeToken]: treeTokenLocator,
  [LocationType.PersonalHelpLine]: personalHelpLineLocator,
  [LocationType.ActionToken]: actionLocator
}
