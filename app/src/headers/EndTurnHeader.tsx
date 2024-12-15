/** @jsxImportSource @emotion/react */
import { LivingForestDuelRules } from '@gamepark/living-forest-duel/LivingForestDuelRules'
import { LocationType } from '@gamepark/living-forest-duel/material/LocationType'
import { MaterialType } from '@gamepark/living-forest-duel/material/MaterialType'
import { EndTurnRule } from '@gamepark/living-forest-duel/rules/EndTurnRule'
import { useRules } from '@gamepark/react-game'
import { useTranslation } from 'react-i18next'

export const EndTurnHeader = () => {
  const { t } = useTranslation()
  const rules = useRules<LivingForestDuelRules>()!
  const endTurnRule = new EndTurnRule(rules.game)
  let header = ""
  if (endTurnRule.material(MaterialType.AnimalCard).location(LocationType.SharedDeck).getItems().length === 0
    && (endTurnRule.material(MaterialType.ActionToken).location(LocationType.PlayerActionSupply).player(endTurnRule.nextPlayer).length > 0
      || endTurnRule.material(MaterialType.ActionToken).location(LocationType.PlayerActionSupply).player(endTurnRule.player).length > 0)) {
    header = 'header.reshuffling-cards'
  } else {
    header = 'header.end-turn'
  }
  return <>{t(header)}</>
}
