/** @jsxImportSource @emotion/react */

import { LivingForestDuelRules } from "@gamepark/living-forest-duel/LivingForestDuelRules"
import { MaterialType } from "@gamepark/living-forest-duel/material/MaterialType"
import { CustomMoveType } from "@gamepark/living-forest-duel/rules/CustomMoveType"
import { useRules, usePlayerId, usePlayerName, useLegalMove, PlayMoveButton } from "@gamepark/react-game"
import { isCustomMoveType, isMoveItemType } from "@gamepark/rules-api"
import { Trans } from "react-i18next"

export const UseSankiCardHeader = () => {
  const rules = useRules<LivingForestDuelRules>()!
  const me = usePlayerId()
  const activePlayer = rules.getActivePlayer()
  const itsMe = activePlayer === me
  const player = usePlayerName(activePlayer)
  const useSanki = useLegalMove(isMoveItemType(MaterialType.SpiritCard))
  const pass = useLegalMove(isCustomMoveType(CustomMoveType.SankiPass))
  if (itsMe) {
    if (!useSanki) return null
    return (
      <Trans defaults="header.use-sanki-card.you" components={{
        useSanki: <PlayMoveButton move={useSanki} />,
        pass: <PlayMoveButton move={pass} />
      }} />
    )
  } else {
    return <Trans defaults="header.use-sanki-card.player" values={{ player }} />
  }
}
