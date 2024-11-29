/** @jsxImportSource @emotion/react */

import { LivingForestDuelRules } from "@gamepark/living-forest-duel/LivingForestDuelRules"
import { RecruitingAnimalsRule } from "@gamepark/living-forest-duel/rules/RecruitingAnimalsRule"
import { useRules, usePlayerId, usePlayerName } from "@gamepark/react-game"
import { Trans } from "react-i18next"

export const RecruitingAnimalsHeader = () => {
  const rules = useRules<LivingForestDuelRules>()!
  const me = usePlayerId()
  const activePlayer = rules.getActivePlayer()
  const itsMe = activePlayer === me
  const player = usePlayerName(activePlayer)
  const recruitingAnimalsRule = new RecruitingAnimalsRule(rules.game)
  const cost = recruitingAnimalsRule.elementValue
  if (itsMe) {
    return <Trans defaults="header.recruiting-animals.you" values={{ cost }} />
  } else {
    return <Trans defaults="header.recruiting-animals.player" values={{ player, cost }} />
  }
}
