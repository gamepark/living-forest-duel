import { Direction, getEnumValues } from "@gamepark/rules-api"
import { Element } from "../Season"

export enum TreeType {
  Starting = 1,
  Plant,
  Sun,
  Water,
  Wind
}

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
  element: Element,
  elementValue: number,
  cost: number,
  bonus: {
    element: Element,
    river: TreeDirections
  }
}

export const treeProperties: Partial<Record<Tree, TreePattern>> = {
  [Tree.SunTree1]: {
    element: Element.Sun,
    elementValue: 1,
    cost: 1,
    bonus: {
      element: Element.Water,
      river: {
        [Direction.North]: false,
        [Direction.East]: true,
        [Direction.South]: false,
        [Direction.West]: true
      }
    }
  },
  [Tree.SunTree2]: {
    element: Element.Sun,
    elementValue: 1,
    cost: 1,
    bonus: {
      element: Element.Wind,
      river: {
        [Direction.North]: true,
        [Direction.East]: false,
        [Direction.South]: true,
        [Direction.West]: false
      }
    }
  },
  [Tree.SunTree3]: {
    element: Element.Sun,
    elementValue: 1,
    cost: 2,
    bonus: {
      element: Element.Wind,
      river: {
        [Direction.North]: true,
        [Direction.East]: false,
        [Direction.South]: true,
        [Direction.West]: true
      }
    }
  },
  [Tree.SunTree4]: {
    element: Element.Sun,
    elementValue: 1,
    cost: 2,
    bonus: {
      element: Element.Water,
      river: {
        [Direction.North]: true,
        [Direction.East]: true,
        [Direction.South]: true,
        [Direction.West]: false
      }
    }
  },
  [Tree.SunTree5]: {
    element: Element.Sun,
    elementValue: 1,
    cost: 2,
    bonus: {
      element: Element.Water,
      river: {
        [Direction.North]: false,
        [Direction.East]: true,
        [Direction.South]: true,
        [Direction.West]: true
      }
    }
  },
  [Tree.SunTree6]: {
    element: Element.Sun,
    elementValue: 1,
    cost: 2,
    bonus: {
      element: Element.Wind,
      river: {
        [Direction.North]: true,
        [Direction.East]: true,
        [Direction.South]: false,
        [Direction.West]: true  
      }
    }
  },
  [Tree.WaterTree1]: {
    element: Element.Water,
    elementValue: 1,
    cost: 2,
    bonus: {
      element: Element.Wind,
      river: {
        [Direction.North]: false,
        [Direction.East]: true,
        [Direction.South]: false,
        [Direction.West]: true
      }
    }
  },
  [Tree.WaterTree2]: {
    element: Element.Water,
    elementValue: 1,
    cost: 2,
    bonus: {
      element: Element.Wind,
      river: {
        [Direction.North]: true,
        [Direction.East]: false,
        [Direction.South]: true,
        [Direction.West]: false
      }
    }
  },
  [Tree.WaterTree3]: {
    element: Element.Water,
    elementValue: 1,
    cost: 3,
    bonus: {
      element: Element.Water,
      river: {
        [Direction.North]: true,
        [Direction.East]: true,
        [Direction.South]: true,
        [Direction.West]: false
      }
    }
  },
  [Tree.WaterTree4]: {
    element: Element.Water,
    elementValue: 1,
    cost: 3,
    bonus: {
      element: Element.Sun,
      river: {
        [Direction.North]: true,
        [Direction.East]: false,
        [Direction.South]: true,
        [Direction.West]: true
      }
    }
  },
  [Tree.WaterTree5]: {
    element: Element.Water,
    elementValue: 1,
    cost: 3,
    bonus: {
      element: Element.Wind,
      river: {
        [Direction.North]: false,
        [Direction.East]: true,
        [Direction.South]: true,
        [Direction.West]: true  
      }
    }
  },
  [Tree.WaterTree6]: {
    element: Element.Water,
    elementValue: 1,
    cost: 3,
    bonus: {
      element: Element.Sun,
      river: {
        [Direction.North]: true,
        [Direction.East]: true,
        [Direction.South]: false,
        [Direction.West]: true  
      }
    }
  },
  [Tree.PlantTree1]: {
    element: Element.Plant,
    elementValue: 1,
    cost: 4,
    bonus: {
      element: Element.Wind,
      river: {
        [Direction.North]: true,
        [Direction.East]: false,
        [Direction.South]: true,
        [Direction.West]: false
      }
    }
  },
  [Tree.PlantTree2]: {
    element: Element.Plant,
    elementValue: 1,
    cost: 4,
    bonus: {
      element: Element.Wind,
      river: {
        [Direction.North]: false,
        [Direction.East]: true,
        [Direction.South]: false,
        [Direction.West]: true
      }
    }
  },
  [Tree.PlantTree3]: {
    element: Element.Plant,
    elementValue: 1,
    cost: 4,
    bonus: {
      element: Element.Sun,
      river: {
        [Direction.North]: false,
        [Direction.East]: false,
        [Direction.South]: true,
        [Direction.West]: true
      }
    }
  },
  [Tree.PlantTree4]: {
    element: Element.Plant,
    elementValue: 1,
    cost: 4,
    bonus: {
      element: Element.Water,
      river: {
        [Direction.North]: true,
        [Direction.East]: true,
        [Direction.South]: false,
        [Direction.West]: false
      }
    }
  },
  [Tree.PlantTree5]: {
    element: Element.Plant,
    elementValue: 1,
    cost: 5,
    bonus: {
      element: Element.Wind,
      river: {
        [Direction.North]: false,
        [Direction.East]: true,
        [Direction.South]: true,
        [Direction.West]: false  
      }
    }
  },
  [Tree.PlantTree6]: {
    element: Element.Plant,
    elementValue: 1,
    cost: 5,
    bonus: {
      element: Element.Wind,
      river: {
        [Direction.North]: true,
        [Direction.East]: false,
        [Direction.South]: false,
        [Direction.West]: true  
      }
    }
  },
  [Tree.WindTree1]: {
    element: Element.Wind,
    elementValue: 1,
    cost: 4,
    bonus: {
      element: Element.Wind,
      river: {
        [Direction.North]: true,
        [Direction.East]: false,
        [Direction.South]: true,
        [Direction.West]: true
      }
    }
  },
  [Tree.WindTree2]: {
    element: Element.Wind,
    elementValue: 1,
    cost: 4,
    bonus: {
      element: Element.Wind,
      river: {
        [Direction.North]: true,
        [Direction.East]: true,
        [Direction.South]: true,
        [Direction.West]: false
      }
    }
  },
  [Tree.WindTree3]: {
    element: Element.Wind,
    elementValue: 1,
    cost: 3,
    bonus: {
      element: Element.Sun,
      river: {
        [Direction.North]: true,
        [Direction.East]: true,
        [Direction.South]: false,
        [Direction.West]: false
      }
    }
  },
  [Tree.WindTree4]: {
    element: Element.Wind,
    elementValue: 1,
    cost: 3,
    bonus: {
      element: Element.Sun,
      river: {
        [Direction.North]: false,
        [Direction.East]: false,
        [Direction.South]: true,
        [Direction.West]: true
      }
    }
  },
  [Tree.WindTree5]: {
    element: Element.Wind,
    elementValue: 1,
    cost: 3,
    bonus: {
      element: Element.Water,
      river: {
        [Direction.North]: false,
        [Direction.East]: true,
        [Direction.South]: true,
        [Direction.West]: false  
      }
    }
  },
  [Tree.WindTree6]: {
    element: Element.Wind,
    elementValue: 1,
    cost: 3,
    bonus: {
      element: Element.Water,
      river: {
        [Direction.North]: false,
        [Direction.East]: false,
        [Direction.South]: true,
        [Direction.West]: true  
      }
    }
  }
}

export const getTreeSeason = (tree: Tree) => tree < 3 ? tree % 10 : null
export const getTreeType = (tree: Tree): TreeType => Math.floor(tree / 10) + 1

export const treeCards = getEnumValues(Tree).filter(tree => tree >= 11)
export const treeTypes = getEnumValues(TreeType)
