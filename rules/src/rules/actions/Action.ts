import { Element } from '../../Season'
import { RuleId } from '../RuleId'

export type Action = {
  element: Element
  value: number
  bonus?: boolean
}

export const elementActionRule: Record<Element, RuleId> = {
  [Element.Water]: RuleId.ExtinguishingFire,
  [Element.Sun]: RuleId.RecruitingAnimals,
  [Element.Plant]: RuleId.PlantingProtectiveTree,
  [Element.Wind]: RuleId.AdvancingOnibi
}
