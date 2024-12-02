/** @jsxImportSource @emotion/react */

import { LivingForestDuelRules } from "@gamepark/living-forest-duel/LivingForestDuelRules"
import { CustomMoveType } from "@gamepark/living-forest-duel/rules/CustomMoveType"
import { RecruitingAnimalsRule } from "@gamepark/living-forest-duel/rules/RecruitingAnimalsRule"
import { useRules, usePlayerId, usePlayerName, useLegalMove, PlayMoveButton } from "@gamepark/react-game"
import { isCustomMoveType } from "@gamepark/rules-api"
import { Trans } from "react-i18next"

export const RecruitingAnimalsHeader = () => {
  const rules = useRules<LivingForestDuelRules>()!
  const me = usePlayerId()
  const activePlayer = rules.getActivePlayer()
  const itsMe = activePlayer === me
  const player = usePlayerName(activePlayer)
  const recruitingAnimalsRule = new RecruitingAnimalsRule(rules.game)
  const cost = recruitingAnimalsRule.elementValue
  const pass = useLegalMove(isCustomMoveType(CustomMoveType.ActionPass))
  if (itsMe) {
    return <Trans defaults="header.recruiting-animals.you" values={{ cost }} components={{ pass: <PlayMoveButton move={pass} /> }} />
  } else {
    return <Trans defaults="header.recruiting-animals.player" values={{ player, cost }} />
  }
}
