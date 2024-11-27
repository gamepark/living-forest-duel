/** @jsxImportSource @emotion/react */
import { RuleId } from '@gamepark/living-forest-duel/rules/RuleId'
import { ComponentType } from 'react'
import { PlayerActionHeader } from './PlayerActionHeader'
import { UseSankiCardHeader } from './UseSankiCardHeader'

export const Headers: Partial<Record<RuleId, ComponentType>> = {
  [RuleId.PlayerAction]: PlayerActionHeader,
  [RuleId.UseSankiCard]: UseSankiCardHeader
}