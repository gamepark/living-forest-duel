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
import { RevealTreesHeader } from './RevealTreesHeader'
import { UseSankiCardHeader } from './UseSankiCardHeader'

export const Headers: Partial<Record<RuleId, ComponentType>> = {
  [RuleId.PlayerAction]: PlayerActionHeader,
  [RuleId.PlayerUseActionToken]: PlayerUseActionTokenHeader,
  [RuleId.ExtinguishingFire]: ExtinguishingFireHeader,
  [RuleId.RecruitingAnimals]: RecruitingAnimalsHeader,
  [RuleId.RefillRecruitmentLine]: RefillRecruitmentLineHeader,
  [RuleId.PlantingProtectiveTree]: PlantingProtectiveTreeHeader,
  [RuleId.RevealTrees]: RevealTreesHeader,
  [RuleId.AdvancingOnibi]: AdvancingOnibiHeader,
  [RuleId.UseSankiOnVaran]: UseSankiCardHeader,
  [RuleId.UseSankiPlayAction]: UseSankiCardHeader,
  [RuleId.EndTurn]: EndTurnHeader
}