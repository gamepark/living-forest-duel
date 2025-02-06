/** @jsxImportSource @emotion/react */
import { LivingForestDuelRules } from '@gamepark/living-forest-duel/LivingForestDuelRules'
import { CustomMoveType } from '@gamepark/living-forest-duel/rules/CustomMoveType'
import { TreesHelper } from '@gamepark/living-forest-duel/rules/helpers/TreesHelper'
import { PlantingProtectiveTreeRule } from '@gamepark/living-forest-duel/rules/PlantingProtectiveTreeRule'
import { PlayMoveButton, useLegalMove, usePlayerId, usePlayerName, useRules } from '@gamepark/react-game'
import { isCustomMoveType } from '@gamepark/rules-api'
import { Trans } from 'react-i18next'

export const PlantingProtectiveTreeHeader = () => {
  const rules = useRules<LivingForestDuelRules>()!
  const me = usePlayerId()
  const activePlayer = rules.getActivePlayer()!
  const itsMe = activePlayer === me
  const player = usePlayerName(activePlayer)
  const plantingProtectiveTreeRule = new PlantingProtectiveTreeRule(rules.game)
  const cost = plantingProtectiveTreeRule.action.value
  const hasAvailableTrees = new TreesHelper(rules.game).getAvailableTrees(cost).length > 0
  const pass = useLegalMove(isCustomMoveType(CustomMoveType.Pass))

  if (itsMe) {
    if (hasAvailableTrees) {
      return <Trans defaults="header.planting-protective-tree.you" values={{ cost }} components={{
        pass: <PlayMoveButton move={pass}/>
      }}/>
    } else {
      return <Trans defaults="header.planting-protective-tree.pass" components={{
        pass: <PlayMoveButton move={pass} auto={10}/>
      }}/>
    }
  } else {
    return <Trans defaults="header.planting-protective-tree.player" values={{ player, cost }}/>
  }
}
