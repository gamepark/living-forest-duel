/** @jsxImportSource @emotion/react */
import { LivingForestDuelRules } from '@gamepark/living-forest-duel/LivingForestDuelRules'
import { CustomMoveType } from '@gamepark/living-forest-duel/rules/CustomMoveType'
import { RecruitingAnimalsRule } from '@gamepark/living-forest-duel/rules/RecruitingAnimalsRule'
import { PlayMoveButton, useLegalMove, usePlayerId, usePlayerName, useRules } from '@gamepark/react-game'
import { isCustomMoveType } from '@gamepark/rules-api'
import { Trans, useTranslation } from 'react-i18next'

export const RecruitingAnimalsHeader = () => {
  const { t } = useTranslation()
  const rules = useRules<LivingForestDuelRules>()!
  const me = usePlayerId()
  const activePlayer = rules.getActivePlayer()!
  const itsMe = activePlayer === me
  const player = usePlayerName(activePlayer)
  const recruitingAnimalsRule = new RecruitingAnimalsRule(rules.game)
  const cost = recruitingAnimalsRule.action.value
  const pass = useLegalMove(isCustomMoveType(CustomMoveType.Pass))
  const bonusHeader = recruitingAnimalsRule.isBonusAction ? t('header.bonus-header') + ": " : ""

  if (itsMe) {
    <></>
    return <Trans defaults="header.recruiting-animals.you" values={{ bonusHeader, cost }} components={{ pass: <PlayMoveButton move={pass} /> }} />
  } else {
    return <Trans defaults="header.recruiting-animals.player" values={{ bonusHeader, player, cost }} />
  }
}
