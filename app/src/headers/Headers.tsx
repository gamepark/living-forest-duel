/** @jsxImportSource @emotion/react */
import { RuleId } from '@gamepark/living-forest-duel/rules/RuleId'
import { ComponentType } from 'react'
import { TheFirstStepHeader } from './TheFirstStepHeader'

export const Headers: Partial<Record<RuleId, ComponentType>> = {
  [RuleId.TheFirstStep]: TheFirstStepHeader
}