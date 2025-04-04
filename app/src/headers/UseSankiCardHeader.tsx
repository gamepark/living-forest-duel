/** @jsxImportSource @emotion/react */
import { LivingForestDuelRules } from "@gamepark/living-forest-duel/LivingForestDuelRules"
import { MaterialType } from "@gamepark/living-forest-duel/material/MaterialType"
import { CustomMoveType } from "@gamepark/living-forest-duel/rules/CustomMoveType"
import { RuleId } from '@gamepark/living-forest-duel/rules/RuleId'
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
  const pass = useLegalMove(isCustomMoveType(CustomMoveType.Pass))
  if (itsMe) {
    if (!useSanki) return null
    return (
      <Trans defaults="header.use-sanki-card.you" components={{
        useSanki: <PlayMoveButton move={useSanki} />,
        pass: <PlayMoveButton move={pass} auto={rules.game.rule?.id === RuleId.UseSankiPlayAction ? 10 : undefined}/>
      }} />
    )
  } else {
    return <Trans defaults="header.use-sanki-card.player" values={{ player }} />
  }
}
