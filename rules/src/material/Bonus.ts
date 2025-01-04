import { Element } from '../Season'

export enum Bonus {
  Recruit = 1, Extinguish, Plant, Sanki
}

export function getBonusElement(bonus: Bonus): Element {
  switch (bonus) {
    case Bonus.Recruit:
      return Element.Sun
    case Bonus.Extinguish:
      return Element.Water
    case Bonus.Plant:
      return Element.Plant
    default:
      throw new Error('No element match Sanki bonus')
  }
}
