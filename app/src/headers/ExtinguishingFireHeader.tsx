/** @jsxImportSource @emotion/react */

import { LivingForestDuelRules } from "@gamepark/living-forest-duel/LivingForestDuelRules"
import { CustomMoveType } from "@gamepark/living-forest-duel/rules/CustomMoveType"
import { ExtinguishingFireRule } from "@gamepark/living-forest-duel/rules/ExtinguishingFireRule"
import { useRules, usePlayerId, usePlayerName, useLegalMove, PlayMoveButton } from "@gamepark/react-game"
import { isCustomMoveType } from "@gamepark/rules-api"
import { Trans } from "react-i18next"

export const ExtinguishingFireHeader = () => {
  const rules = useRules<LivingForestDuelRules>()!
  const me = usePlayerId()
  const activePlayer = rules.getActivePlayer()
  const itsMe = activePlayer === me
  const player = usePlayerName(activePlayer)
  const extinguishingFireRule = new ExtinguishingFireRule(rules.game)
  const cost = extinguishingFireRule.elementValue
  const pass = useLegalMove(isCustomMoveType(CustomMoveType.ActionPass))

  if (itsMe) {
    return <Trans defaults="header.extinguishing-fire.you" values={{ cost }} components={{ pass: <PlayMoveButton move={pass} /> }} />
  } else {
    return <Trans defaults="header.extinguishing-fire.player" values={{ player, cost }} />
  }
}
