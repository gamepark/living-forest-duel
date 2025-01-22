import { LocationType } from '@gamepark/living-forest-duel/material/LocationType'
import { MaterialType } from '@gamepark/living-forest-duel/material/MaterialType'
import { Season } from '@gamepark/living-forest-duel/Season'
import { Locator } from '@gamepark/react-game'
import { animalCostLocator } from './AnimalCostLocator'
import { animalSeasonLocator } from './AnimalSeasonLocator'
import { clearingCardBonusLocator } from './ClearingCardBonusLocator'
import { clearingCardSpotLocator } from './ClearingCardSpotLocator'
import { clearingLineLocator } from './ClearingLineLocator'
import { fireStockLocator } from './FireStockLocator'
import { onibiCardLocator } from './OnibiCardLocator'
import { playerActionLostLocator } from './PlayerActionLostLocator'
import { playerActionSupplyLocator } from './PlayerActionSupplyLocator'
import { playerFireStockLocator } from './PlayerFireStockLocator'
import { playerForestLocator } from './PlayerForestLocator'
import { playerHelpLineLocator } from './PlayerHelpLineLocator'
import { playerSpiritLineLocator } from './PlayerSpiritLineLocator'
import { pointElementLocator } from './PointElementLocator'
import { recruitmentLineLocator } from './RecruitmentLineLocator'
import { sankiDeckLocator } from './SankiDeckLocator'
import { seasonAnimalDeckLocator } from './SeasonAnimalDeckLocator'
import { sharedDeckLocator } from './SharedDeckLocator'
import { sharedDiscardPileLocator } from './SharedDiscardPileLocator'
import { sharedHelpLineLocator } from './SharedHelpLineLocator'
import { treeCostLocator } from './TreeCostLocator'
import { treeDeckSpotLocator } from './TreeDeckSpotLocator'
import { treeElementLocator } from './TreeElementLocator'
import { treeTokenLocator } from './TreeTokenLocator'
import { varanDecksLocator } from './VaranDecksLocator'

export const Locators: Partial<Record<LocationType, Locator<Season, MaterialType, LocationType>>> = {
  [LocationType.ClearingLine]: clearingLineLocator,
  [LocationType.ClearingCardSpot]: clearingCardSpotLocator,
  [LocationType.FireStock]: fireStockLocator,
  [LocationType.TreeDeckSpot]: treeDeckSpotLocator,
  [LocationType.RecruitmentLine]: recruitmentLineLocator,
  [LocationType.VaranDeck]: varanDecksLocator,
  [LocationType.SeasonAnimalDeck]: seasonAnimalDeckLocator,
  [LocationType.PlayerHelpLine]: playerHelpLineLocator,
  [LocationType.PlayerSpiritLine]: playerSpiritLineLocator,
  [LocationType.PlayerForest]: playerForestLocator,
  [LocationType.PlayerActionSupply]: playerActionSupplyLocator,
  [LocationType.PlayerActionLost]: playerActionLostLocator,
  [LocationType.PlayerFireStock]: playerFireStockLocator,
  [LocationType.OnibiCard]: onibiCardLocator,
  [LocationType.SankiDeck]: sankiDeckLocator,
  [LocationType.SharedHelpLine]: sharedHelpLineLocator,
  [LocationType.SharedDeck]: sharedDeckLocator,
  [LocationType.SharedDiscardPile]: sharedDiscardPileLocator,
  [LocationType.TreeToken]: treeTokenLocator,
  [LocationType.PointElement]: pointElementLocator,
  [LocationType.AnimalCost]: animalCostLocator,
  [LocationType.AnimalSeason]: animalSeasonLocator,
  [LocationType.TreeCost]: treeCostLocator,
  [LocationType.TreeElement]: treeElementLocator,
  [LocationType.ClearingCardBonus]: clearingCardBonusLocator
}
