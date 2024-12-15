/** @jsxImportSource @emotion/react */

import { LivingForestDuelRules } from "@gamepark/living-forest-duel/LivingForestDuelRules"
import { CustomMoveType } from "@gamepark/living-forest-duel/rules/CustomMoveType"
import { ExtinguishingFireRule } from "@gamepark/living-forest-duel/rules/ExtinguishingFireRule"
import { ElementsHelper } from "@gamepark/living-forest-duel/rules/helpers/ElementsHelper"
import { useRules, usePlayerId, usePlayerName, useLegalMove, PlayMoveButton } from "@gamepark/react-game"
import { isCustomMoveType } from "@gamepark/rules-api"
import { Trans, useTranslation } from "react-i18next"

export const ExtinguishingFireHeader = () => {
  const { t } = useTranslation()
  const rules = useRules<LivingForestDuelRules>()!
  const me = usePlayerId()
  const activePlayer = rules.getActivePlayer()
  const itsMe = activePlayer === me
  const player = usePlayerName(activePlayer)
  const extinguishingFireRule = new ExtinguishingFireRule(rules.game)
  const cost = extinguishingFireRule.elementValue
  const pass = useLegalMove(isCustomMoveType(CustomMoveType.Pass))
  const elementsHelper = new ElementsHelper(rules.game, activePlayer)
  const bonusHeader = elementsHelper.isBonusAction() ? t('header.bonus-header') + ": " : ""

  if (itsMe) {
    return <Trans defaults="header.extinguishing-fire.you" values={{ bonusHeader, cost }} components={{ pass: <PlayMoveButton move={pass} /> }} />
  } else {
    return <Trans defaults="header.extinguishing-fire.player" values={{ bonusHeader, player, cost }} />
  }
}
