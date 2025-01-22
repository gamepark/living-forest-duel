import { LivingForestDuelRules } from '@gamepark/living-forest-duel/LivingForestDuelRules'
import { MaterialType } from '@gamepark/living-forest-duel/material/MaterialType'
import { CustomMoveType } from '@gamepark/living-forest-duel/rules/CustomMoveType'
import { AnimalsHelper } from '@gamepark/living-forest-duel/rules/helpers/AnimalsHelper'
import { ElementsHelper } from '@gamepark/living-forest-duel/rules/helpers/ElementsHelper'
import { RuleId } from '@gamepark/living-forest-duel/rules/RuleId'
import { Element, Season } from '@gamepark/living-forest-duel/Season'
import { GameAI } from '@gamepark/react-game'
import { isCustomMoveType, isMoveItem, MaterialGame } from '@gamepark/rules-api'
import { maxBy, sample } from 'lodash'

export const TutorialAI: GameAI = (game: MaterialGame, player: Season) => {
  let legalMoves = new LivingForestDuelRules(game).getLegalMoves(player)
  if (game.rule?.id === RuleId.UseSankiPlayAction) {
    legalMoves = legalMoves.filter(isCustomMoveType(CustomMoveType.Pass))
  }
  if (legalMoves.length !== 1) {
    legalMoves = legalMoves.filter(move => !isCustomMoveType(CustomMoveType.Pass)(move))
  }
  const moveOnibi = legalMoves.filter(isCustomMoveType(CustomMoveType.MoveOnibi))
  if (moveOnibi.length) {
    legalMoves = [maxBy(moveOnibi, move => move.data ?? 0)!]
  }
  if (game.rule?.id === RuleId.PlayerAction) {
    const solitaries = new AnimalsHelper(game).countSolitary(player)
    const actionValueModifier = solitaries === 0 ? 0.5 : solitaries === 1 ? 1 : 1.5
    legalMoves = legalMoves.filter(move => {
      if (!isMoveItem(move) || move.itemType !== MaterialType.ActionToken) return true
      const element = move.location.id as Element
      const elementModifier = element === Element.Wind ? 2 : Element.Plant ? 1.5 : 1
      const value = new ElementsHelper(game, player).getElementValue(element)
      return value * elementModifier > 5 / actionValueModifier
    })
  }
  return Promise.resolve([sample(legalMoves)])
}
