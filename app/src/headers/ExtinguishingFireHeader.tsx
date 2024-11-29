/** @jsxImportSource @emotion/react */

import { LivingForestDuelRules } from "@gamepark/living-forest-duel/LivingForestDuelRules"
import { ExtinguishingFireRule } from "@gamepark/living-forest-duel/rules/ExtinguishingFireRule"
import { useRules, usePlayerId, usePlayerName } from "@gamepark/react-game"
import { Trans } from "react-i18next"

export const ExtinguishingFireHeader = () => {
  const rules = useRules<LivingForestDuelRules>()!
  const me = usePlayerId()
  const activePlayer = rules.getActivePlayer()
  const itsMe = activePlayer === me
  const player = usePlayerName(activePlayer)
  const extinguishingFireRule = new ExtinguishingFireRule(rules.game)
  const cost = extinguishingFireRule.elementValue
  if (itsMe) {
    return <Trans defaults="header.extinguishing-fire.you" values={{ cost }} />
  } else {
    return <Trans defaults="header.extinguishing-fire.player" values={{ player, cost }} />
  }
}
