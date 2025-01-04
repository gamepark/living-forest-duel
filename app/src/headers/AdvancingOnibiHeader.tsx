/** @jsxImportSource @emotion/react */
import { LivingForestDuelRules } from '@gamepark/living-forest-duel/LivingForestDuelRules'
import { AdvancingOnibiRule } from '@gamepark/living-forest-duel/rules/AdvancingOnibiRule'
import { usePlayerId, usePlayerName, useRules } from '@gamepark/react-game'
import { Trans } from 'react-i18next'

export const AdvancingOnibiHeader = () => {
  const rules = useRules<LivingForestDuelRules>()!
  const me = usePlayerId()
  const activePlayer = rules.getActivePlayer()
  const itsMe = activePlayer === me
  const player = usePlayerName(activePlayer)
  const advancingOnibiRule = new AdvancingOnibiRule(rules.game)
  const steps = advancingOnibiRule.action?.value ?? 0

  if (itsMe) {
    return <Trans defaults="header.advancing-onibi.you" values={{ steps }}/>
  } else {
    return <Trans defaults="header.advancing-onibi.player" values={{ player, steps }}/>
  }
}
