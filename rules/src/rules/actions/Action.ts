import { Element } from '../../Season'
import { RuleId } from '../RuleId'

export type Action = ExtinguishingFire | RecruitingAnimals | PlantingProtectiveTrees | AdvancingOnibi

export type ExtinguishingFire = {
  element: Element.Water
  value: number
  bonus?: boolean
}

export type RecruitingAnimals = {
  element: Element.Sun
  value: number
  bonus?: boolean
}

export type PlantingProtectiveTrees = {
  element: Element.Plant
  value: number
  plantedTreesElements: Element[]
  bonus?: boolean
}

export type AdvancingOnibi = {
  element: Element.Wind
  value: number
}

export const elementActionRule: Record<Element, RuleId> = {
  [Element.Water]: RuleId.ExtinguishingFire,
  [Element.Sun]: RuleId.RecruitingAnimals,
  [Element.Plant]: RuleId.PlantingProtectiveTree,
  [Element.Wind]: RuleId.AdvancingOnibi
}
