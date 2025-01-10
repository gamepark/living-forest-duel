import { LocationType } from '@gamepark/living-forest-duel/material/LocationType'
import { MaterialType } from '@gamepark/living-forest-duel/material/MaterialType'
import { MaterialGameAnimations } from '@gamepark/react-game'
import { isMoveItemType } from '@gamepark/rules-api'

export const gameAnimations = new MaterialGameAnimations()

gameAnimations.when()
  .move(move => isMoveItemType(MaterialType.ActionToken)(move) && move.location.type === LocationType.PlayerActionSupply)
  .duration(0.5)