/** @jsxImportSource @emotion/react */
import { RuleId } from '@gamepark/living-forest-duel/rules/RuleId'
import { ComponentType } from 'react'
import { AdvancingOnibiHeader } from './AdvancingOnibiHeader'
import { EndTurnHeader } from './EndTurnHeader'
import { ExtinguishingFireHeader } from './ExtinguishingFireHeader'
import { PlantingProtectiveTreeHeader } from './PlantingProtectiveTreeHeader'
import { PlayerActionHeader } from './PlayerActionHeader'
import { PlayerUseActionTokenHeader } from './PlayerUseActionTokenHeader'
import { RecruitingAnimalsHeader } from './RecruitingAnimalsHeader'
import { RefillRecruitmentLineHeader } from './RefillRecruitmentLineHeader'
import { UseSankiCardHeader } from './UseSankiCardHeader'

export const Headers: Partial<Record<RuleId, ComponentType>> = {
  [RuleId.AdvancingOnibi]: AdvancingOnibiHeader,
  [RuleId.ExtinguishingFire]: ExtinguishingFireHeader,
  [RuleId.PlantingProtectiveTree]: PlantingProtectiveTreeHeader,
  [RuleId.PlayerAction]: PlayerActionHeader,
  [RuleId.PlayerUseActionToken]: PlayerUseActionTokenHeader,
  [RuleId.RecruitingAnimals]: RecruitingAnimalsHeader,
  [RuleId.UseSankiOnVaran]: UseSankiCardHeader,
  [RuleId.UseSankiPlayAction]: UseSankiCardHeader,
  [RuleId.RefillRecruitmentLine]: RefillRecruitmentLineHeader,
  [RuleId.EndTurn]: EndTurnHeader
}