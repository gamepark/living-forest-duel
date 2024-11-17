/** @jsxImportSource @emotion/react */
import { RuleId } from '@gamepark/living-forest-duel/rules/RuleId'
import { ComponentType } from 'react'
import { PlayerActionHeader } from './PlayerActionHeader'

export const Headers: Partial<Record<RuleId, ComponentType>> = {
  [RuleId.PlayerAction]: PlayerActionHeader
}