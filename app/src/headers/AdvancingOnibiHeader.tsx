/** @jsxImportSource @emotion/react */

import { LivingForestDuelRules } from "@gamepark/living-forest-duel/LivingForestDuelRules"
import { AdvancingOnibiRule } from "@gamepark/living-forest-duel/rules/AdvancingOnibiRule"
import { Memory } from "@gamepark/living-forest-duel/rules/Memory"
import { useRules, usePlayerId, usePlayerName } from "@gamepark/react-game"
import { Trans, useTranslation } from "react-i18next"

export const AdvancingOnibiHeader = () => {
  const { t } = useTranslation()
  const rules = useRules<LivingForestDuelRules>()!
  const me = usePlayerId()
  const activePlayer = rules.getActivePlayer()
  const itsMe = activePlayer === me
  const player = usePlayerName(activePlayer)
  const advancingOnibiRule = new AdvancingOnibiRule(rules.game)
  const steps = advancingOnibiRule.elementValue
  const bonusHeader = advancingOnibiRule.remind(Memory.BonusAction) ? t('header.bonus-header') : ""
  if (itsMe) {
    return <Trans defaults="header.advancing-onibi.you" values={{ bonusHeader, steps }} />
  } else {
    return <Trans defaults="header.advancing-onibi.player" values={{ bonusHeader, player, steps }} />
  }
}
