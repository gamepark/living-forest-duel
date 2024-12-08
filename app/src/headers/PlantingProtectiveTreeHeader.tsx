/** @jsxImportSource @emotion/react */

import { LivingForestDuelRules } from "@gamepark/living-forest-duel/LivingForestDuelRules"
import { CustomMoveType } from "@gamepark/living-forest-duel/rules/CustomMoveType"
import { PlantingProtectiveTreeRule } from "@gamepark/living-forest-duel/rules/PlantingProtectiveTreeRule"
import { useRules, usePlayerId, usePlayerName, useLegalMove, PlayMoveButton } from "@gamepark/react-game"
import { isCustomMoveType } from "@gamepark/rules-api"
import { Trans } from "react-i18next"

export const PlantingProtectiveTreeHeader = () => {
  const rules = useRules<LivingForestDuelRules>()!
  const me = usePlayerId()
  const activePlayer = rules.getActivePlayer()
  const itsMe = activePlayer === me
  const player = usePlayerName(activePlayer)
  const plantingProtectiveTreeRule = new PlantingProtectiveTreeRule(rules.game)
  const cost = plantingProtectiveTreeRule.elementValue
  const pass = useLegalMove(isCustomMoveType(CustomMoveType.ActionPass))

  if (itsMe) {
    return <Trans defaults="header.planting-protective-tree.you" values={{ cost }} components={{ pass: <PlayMoveButton move={pass} /> }} />
  } else {
    return <Trans defaults="header.planting-protective-tree.player" values={{ player, cost }} />
  }
}
