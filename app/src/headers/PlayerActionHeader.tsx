
import { LivingForestDuelRules } from "@gamepark/living-forest-duel/LivingForestDuelRules"
import { useRules, usePlayerId, usePlayerName } from "@gamepark/react-game"
import { useTranslation } from "react-i18next"

export const PlayerActionHeader = () => {
  const { t } = useTranslation()
  const rules = useRules<LivingForestDuelRules>()!
  const me = usePlayerId()
  const activePlayer = rules.getActivePlayer()
  const player = usePlayerName(activePlayer)
  if (activePlayer === me) {
    return <>{t('header.player-action.you')}</>
  } else {
    return <>{t('header.player-action.player', { player })}</>
  }
}
