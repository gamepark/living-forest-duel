import { Direction, getEnumValues } from '@gamepark/rules-api'
import { Element } from '../Season'
import { Bonus } from './Bonus'

export enum Tree {
  // Starting trees
  SummerStartingTree = 1,
  WinterStartingTree,
  // Sun trees
  SunTree1 = 11,
  SunTree2,
  SunTree3,
  SunTree4,
  SunTree5,
  SunTree6,
  // Water trees
  WaterTree1 = 21,
  WaterTree2,
  WaterTree3,
  WaterTree4,
  WaterTree5,
  WaterTree6,
  // Plant trees
  PlantTree1 = 31,
  PlantTree2,
  PlantTree3,
  PlantTree4,
  PlantTree5,
  PlantTree6,
  // Wind trees
  WindTree1 = 41,
  WindTree2,
  WindTree3,
  WindTree4,
  WindTree5,
  WindTree6
}

export type TreeDirections = {
  [Direction.North]: boolean,
  [Direction.East]: boolean,
  [Direction.South]: boolean,
  [Direction.West]: boolean
}

export type TreePattern = {
  cost: number,
  bonus: Bonus
  river: TreeDirections
}

export const treeProperties: Partial<Record<Tree, TreePattern>> = {
  [Tree.SunTree1]: {
    cost: 1,
    bonus: Bonus.Extinguish,
    river: {
      [Direction.North]: false,
      [Direction.East]: true,
      [Direction.South]: false,
      [Direction.West]: true
    }
  },
  [Tree.SunTree2]: {
    cost: 1,
    bonus: Bonus.Sanki,
    river: {
      [Direction.North]: true,
      [Direction.East]: false,
      [Direction.South]: true,
      [Direction.West]: false
    }
  },
  [Tree.SunTree3]: {
    cost: 2,
    bonus: Bonus.Sanki,
    river: {
      [Direction.North]: true,
      [Direction.East]: false,
      [Direction.South]: true,
      [Direction.West]: true
    }
  },
  [Tree.SunTree4]: {
    cost: 2,
    bonus: Bonus.Extinguish,
    river: {
      [Direction.North]: true,
      [Direction.East]: true,
      [Direction.South]: true,
      [Direction.West]: false
    }
  },
  [Tree.SunTree5]: {
    cost: 2,
    bonus: Bonus.Extinguish,
    river: {
      [Direction.North]: false,
      [Direction.East]: true,
      [Direction.South]: true,
      [Direction.West]: true
    }
  },
  [Tree.SunTree6]: {
    cost: 2,
    bonus: Bonus.Sanki,
    river: {
      [Direction.North]: true,
      [Direction.East]: true,
      [Direction.South]: false,
      [Direction.West]: true
    }
  },
  [Tree.WaterTree1]: {
    cost: 2,
    bonus: Bonus.Sanki,
    river: {
      [Direction.North]: false,
      [Direction.East]: true,
      [Direction.South]: false,
      [Direction.West]: true
    }
  },
  [Tree.WaterTree2]: {
    cost: 2,
    bonus: Bonus.Sanki,
    river: {
      [Direction.North]: true,
      [Direction.East]: false,
      [Direction.South]: true,
      [Direction.West]: false
    }
  },
  [Tree.WaterTree3]: {
    cost: 3,
    bonus: Bonus.Sanki,
    river: {
      [Direction.North]: true,
      [Direction.East]: true,
      [Direction.South]: true,
      [Direction.West]: false
    }
  },
  [Tree.WaterTree4]: {
    cost: 3,
    bonus: Bonus.Recruit,
    river: {
      [Direction.North]: true,
      [Direction.East]: false,
      [Direction.South]: true,
      [Direction.West]: true
    }
  },
  [Tree.WaterTree5]: {
    cost: 3,
    bonus: Bonus.Sanki,
    river: {
      [Direction.North]: false,
      [Direction.East]: true,
      [Direction.South]: true,
      [Direction.West]: true
    }
  },
  [Tree.WaterTree6]: {
    cost: 3,
    bonus: Bonus.Recruit,
    river: {
      [Direction.North]: true,
      [Direction.East]: true,
      [Direction.South]: false,
      [Direction.West]: true
    }
  },
  [Tree.PlantTree1]: {
    cost: 4,
    bonus: Bonus.Sanki,
    river: {
      [Direction.North]: true,
      [Direction.East]: false,
      [Direction.South]: true,
      [Direction.West]: false
    }
  },
  [Tree.PlantTree2]: {
    cost: 4,
    bonus: Bonus.Sanki,
    river: {
      [Direction.North]: false,
      [Direction.East]: true,
      [Direction.South]: false,
      [Direction.West]: true
    }
  },
  [Tree.PlantTree3]: {
    cost: 4,
    bonus: Bonus.Recruit,
    river: {
      [Direction.North]: false,
      [Direction.East]: false,
      [Direction.South]: true,
      [Direction.West]: true
    }
  },
  [Tree.PlantTree4]: {
    cost: 4,
    bonus: Bonus.Extinguish,
    river: {
      [Direction.North]: true,
      [Direction.East]: true,
      [Direction.South]: false,
      [Direction.West]: false
    }
  },
  [Tree.PlantTree5]: {
    cost: 5,
    bonus: Bonus.Sanki,
    river: {
      [Direction.North]: false,
      [Direction.East]: true,
      [Direction.South]: true,
      [Direction.West]: false
    }
  },
  [Tree.PlantTree6]: {
    cost: 5,
    bonus: Bonus.Sanki,
    river: {
      [Direction.North]: true,
      [Direction.East]: false,
      [Direction.South]: false,
      [Direction.West]: true
    }
  },
  [Tree.WindTree1]: {
    cost: 4,
    bonus: Bonus.Sanki,
    river: {
      [Direction.North]: true,
      [Direction.East]: false,
      [Direction.South]: true,
      [Direction.West]: true
    }
  },
  [Tree.WindTree2]: {
    cost: 4,
    bonus: Bonus.Sanki,
    river: {
      [Direction.North]: true,
      [Direction.East]: true,
      [Direction.South]: true,
      [Direction.West]: false
    }
  },
  [Tree.WindTree3]: {
    cost: 3,
    bonus: Bonus.Recruit,
    river: {
      [Direction.North]: true,
      [Direction.East]: true,
      [Direction.South]: false,
      [Direction.West]: false
    }
  },
  [Tree.WindTree4]: {
    cost: 3,
    bonus: Bonus.Recruit,
    river: {
      [Direction.North]: true,
      [Direction.East]: false,
      [Direction.South]: false,
      [Direction.West]: true
    }
  },
  [Tree.WindTree5]: {
    cost: 3,
    bonus: Bonus.Extinguish,
    river: {
      [Direction.North]: false,
      [Direction.East]: true,
      [Direction.South]: true,
      [Direction.West]: false
    }
  },
  [Tree.WindTree6]: {
    cost: 3,
    bonus: Bonus.Extinguish,
    river: {
      [Direction.North]: false,
      [Direction.East]: false,
      [Direction.South]: true,
      [Direction.West]: true
    }
  }
}

export const getTreeElement = (tree: Tree): Element | undefined => Math.floor(tree / 10) || undefined

export const treeCards = getEnumValues(Tree).filter(tree => tree >= 11)

export const isStartingTree = (tree?: Tree) => tree !== undefined && tree <= 2
