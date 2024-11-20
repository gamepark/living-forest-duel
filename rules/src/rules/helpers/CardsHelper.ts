import { Material, MaterialGame, MaterialRulesPart } from "@gamepark/rules-api";
import { Animal, animalProperties, CardPattern } from "../../material/Animal";
import { minBy, sumBy } from "lodash";
import { MaterialType } from "../../material/MaterialType";
import { LocationType } from "../../material/LocationType";
import { Tree, TreePattern, treeProperties } from "../../material/Tree";

export class AnimalsHelper extends MaterialRulesPart {
  constructor(game: MaterialGame, readonly player?: number) {
    super(game)
  }

  getAnimalsCostSum(animalsIds: number[]) {
    return this.getCostSum(this.getAnimalsProperties(animalsIds))
  }

  getAnimalsMinCost(animalsIds: number[]) {
    return this.getMinCostElement(this.getAnimalsProperties(animalsIds))?.cost
  }

  getAnimalsProperties(animalsIds: number[]) {
    const filteredProperties = Object.keys(animalProperties).reduce((acc, key) => {
      if (animalsIds.includes(Number(key))) {
        acc[key] = animalProperties[Number(key) as Animal]
      }
      return acc
    }, {} as Record<string, any>)

    return filteredProperties
  }

  getCostSum(properties: Partial<Record<Animal, CardPattern>>) {
    return sumBy(Object.values(properties), 'cost')
  }

  getMinCostElement(properties: Partial<Record<Animal, CardPattern>>) {
    return minBy(Object.values(properties), 'cost')
  }

}

export class TreesHelper extends MaterialRulesPart {
  constructor(game: MaterialGame, readonly player?: number) {
    super(game)
  }

  getVisibleTreesInStack(): Material {
    const treesInDecks = this.material(MaterialType.TreeCard).location(LocationType.TreeDeckSpot)
    const items = treesInDecks.getItems()
    return treesInDecks.location(l => !items.some(item => item.location.id === l.id && item.location.x! > l.x!))
  }

  getTreesMinCost(treesIds: number[]) {
    return this.getMinCostElement(this.getTreesProperties(treesIds))?.cost
  }

  getTreesProperties(treesIds: number[]) {
    const filteredProperties = Object.keys(treeProperties).reduce((acc, key) => {
      if (treesIds.includes(Number(key))) {
        acc[key] = treeProperties[Number(key) as Tree]
      }
      return acc
    }, {} as Record<string, any>)

    return filteredProperties
  }

  // getCostSum(properties: Partial<Record<Animal, CardPattern>>) {
  //   return sumBy(Object.values(properties), 'cost')
  // }

  getMinCostElement(properties: Partial<Record<Tree, TreePattern>>) {
    return minBy(Object.values(properties), 'cost')
  }

}

