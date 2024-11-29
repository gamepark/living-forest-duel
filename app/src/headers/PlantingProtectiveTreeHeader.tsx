/** @jsxImportSource @emotion/react */

import { LivingForestDuelRules } from "@gamepark/living-forest-duel/LivingForestDuelRules"
import { PlantingProtectiveTreeRule } from "@gamepark/living-forest-duel/rules/PlantingProtectiveTreeRule"
import { useRules, usePlayerId, usePlayerName } from "@gamepark/react-game"
import { Trans } from "react-i18next"

export const PlantingProtectiveTreeHeader = () => {
  const rules = useRules<LivingForestDuelRules>()!
  const me = usePlayerId()
  const activePlayer = rules.getActivePlayer()
  const itsMe = activePlayer === me
  const player = usePlayerName(activePlayer)
  const plantingProtectiveTreeRule = new PlantingProtectiveTreeRule(rules.game)
  const cost = plantingProtectiveTreeRule.elementValue
  if (itsMe) {
    return <Trans defaults="header.planting-protective-tree.you" values={{ cost }} />
  } else {
    return <Trans defaults="header.planting-protective-tree.player" values={{ player, cost }} />
  }
}
