import { getEnumValues } from "@gamepark/rules-api"

export enum TreeType {
  Starting = 1,
  Plant,
  Sun,
  Water,
  Wind
}

export enum Tree {
  // 
  SummerStartingTree = 1,
  WinterStartingTree,
  // Sun trees
  SunTree1 = 101,
  SunTree2,
  SunTree3,
  SunTree4,
  SunTree5,
  SunTree6,
  // Water trees
  WaterTree1 = 201,
  WaterTree2,
  WaterTree3,
  WaterTree4,
  WaterTree5,
  WaterTree6,
  // Plant trees
  PlantTree1 = 301,
  PlantTree2,
  PlantTree3,
  PlantTree4,
  PlantTree5,
  PlantTree6,
  // Wind trees
  WindTree1 = 401,
  WindTree2,
  WindTree3,
  WindTree4,
  WindTree5,
  WindTree6
}

export const getTreeSeason = (tree: Tree) => tree < 3 ? tree % 10 : null
export const getTreeType = (tree: Tree) => Math.floor(tree / 100) + 1

export const treeCards = getEnumValues(Tree).filter(tree => tree >= 101)
export const treeTypes = getEnumValues(TreeType)
