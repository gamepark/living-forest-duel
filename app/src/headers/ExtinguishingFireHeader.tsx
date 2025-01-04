/** @jsxImportSource @emotion/react */
import { LivingForestDuelRules } from '@gamepark/living-forest-duel/LivingForestDuelRules'
import { CustomMoveType } from '@gamepark/living-forest-duel/rules/CustomMoveType'
import { ExtinguishingFireRule } from '@gamepark/living-forest-duel/rules/ExtinguishingFireRule'
import { PlayMoveButton, useLegalMove, usePlayerId, usePlayerName, useRules } from '@gamepark/react-game'
import { isCustomMoveType } from '@gamepark/rules-api'
import { Trans } from 'react-i18next'

export const ExtinguishingFireHeader = () => {
  const rules = useRules<LivingForestDuelRules>()!
  const me = usePlayerId()
  const activePlayer = rules.getActivePlayer()!
  const itsMe = activePlayer === me
  const player = usePlayerName(activePlayer)
  const extinguishingFireRule = new ExtinguishingFireRule(rules.game)
  const cost = extinguishingFireRule.action.value
  const pass = useLegalMove(isCustomMoveType(CustomMoveType.Pass))

  if (itsMe) {
    return <Trans defaults="header.extinguishing-fire.you" values={{ cost }} components={{
      pass: <PlayMoveButton move={pass}/>
    }}/>
  } else {
    return <Trans defaults="header.extinguishing-fire.player" values={{ player, cost }}/>
  }
}
