/** @jsxImportSource @emotion/react */
import { RuleId } from '@gamepark/living-forest-duel/rules/RuleId'
import { ComponentType } from 'react'
import { PlayerActionHeader } from './PlayerActionHeader'
import { UseSankiCardHeader } from './UseSankiCardHeader'
import { AdvancingOnibiHeader } from './AdvancingOnibiHeader'
import { EndGameHeader } from './EndGameHeader'
import { ExtinguishingFireHeader } from './ExtinguishingFireHeader'
import { PlantingProtectiveTreeHeader } from './PlantingProtectiveTreeHeader'
import { PlayerUseActionTokenHeader } from './PlayerUseActionTokenHeader'
import { RecruitingAnimalsHeader } from './RecruitingAnimalsHeader'
import { RefillRecruitmentLineHeader } from './RefillRecruitmentLineHeader'
import { EndTurnHeader } from './EndTurnHeader'
import { OnibiBonusActionHeader } from './OnibiBonusActionHeader'
import { TreeBonusActionHeader } from './TreeBonusActionHeader'

export const Headers: Partial<Record<RuleId, ComponentType>> = {
  [RuleId.AdvancingOnibi]: AdvancingOnibiHeader,
  [RuleId.ExtinguishingFire]: ExtinguishingFireHeader,
  [RuleId.PlantingProtectiveTree]: PlantingProtectiveTreeHeader,
  [RuleId.PlayerAction]: PlayerActionHeader,
  [RuleId.PlayerUseActionToken]: PlayerUseActionTokenHeader,
  [RuleId.RecruitingAnimals]: RecruitingAnimalsHeader,
  [RuleId.UseSankiCard]: UseSankiCardHeader,
  [RuleId.RefillRecruitmentLine]: RefillRecruitmentLineHeader,
  [RuleId.OnibiBonusAction]: OnibiBonusActionHeader,
  [RuleId.TreeBonusAction]: TreeBonusActionHeader,
  [RuleId.EndTurn]: EndTurnHeader,
  [RuleId.EndGame]: EndGameHeader
}