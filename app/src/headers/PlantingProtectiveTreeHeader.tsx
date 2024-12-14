/** @jsxImportSource @emotion/react */

import { LivingForestDuelRules } from "@gamepark/living-forest-duel/LivingForestDuelRules"
import { CustomMoveType } from "@gamepark/living-forest-duel/rules/CustomMoveType"
import { Memory } from "@gamepark/living-forest-duel/rules/Memory"
import { PlantingProtectiveTreeRule } from "@gamepark/living-forest-duel/rules/PlantingProtectiveTreeRule"
import { useRules, usePlayerId, usePlayerName, useLegalMove, PlayMoveButton } from "@gamepark/react-game"
import { isCustomMoveType } from "@gamepark/rules-api"
import { Trans, useTranslation } from "react-i18next"

export const PlantingProtectiveTreeHeader = () => {
  const { t } = useTranslation()
  const rules = useRules<LivingForestDuelRules>()!
  const me = usePlayerId()
  const activePlayer = rules.getActivePlayer()
  const itsMe = activePlayer === me
  const player = usePlayerName(activePlayer)
  const plantingProtectiveTreeRule = new PlantingProtectiveTreeRule(rules.game)
  const cost = plantingProtectiveTreeRule.elementValue
  const pass = useLegalMove(isCustomMoveType(CustomMoveType.Pass))
  const bonusHeader = plantingProtectiveTreeRule.remind(Memory.BonusAction) ? t('header.bonus-header') : ""

  if (itsMe) {
    return <Trans defaults="header.planting-protective-tree.you" values={{ bonusHeader, cost }} components={{ pass: <PlayMoveButton move={pass} /> }} />
  } else {
    return <Trans defaults="header.planting-protective-tree.player" values={{ bonusHeader, player, cost }} />
  }
}
