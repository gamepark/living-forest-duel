import { getEnumValues } from "@gamepark/rules-api"
import { Element } from "../Season"

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

export type Directions = {
  north: boolean,
  east: boolean,
  south: boolean,
  west: boolean
}

export type TreePattern = {
  element: Element,
  cost: number,
  bonus: {
    element: Element,
    river: Directions
  }
}

export const treeProperties: Partial<Record<Tree, TreePattern>> = {
  [Tree.SunTree1]: {
    element: Element.Sun,
    cost: 1,
    bonus: {
      element: Element.Water,
      river: {
        north: false,
        east: true,
        south: false,
        west: true
      }
    }
  },
  [Tree.SunTree2]: {
    element: Element.Sun,
    cost: 1,
    bonus: {
      element: Element.Wind,
      river: {
        north: true,
        east: false,
        south: true,
        west: false
      }
    }
  },
  [Tree.SunTree3]: {
    element: Element.Sun,
    cost: 2,
    bonus: {
      element: Element.Wind,
      river: {
        north: true,
        east: false,
        south: true,
        west: true
      }
    }
  },
  [Tree.SunTree4]: {
    element: Element.Sun,
    cost: 2,
    bonus: {
      element: Element.Water,
      river: {
        north: true,
        east: true,
        south: true,
        west: false
      }
    }
  },
  [Tree.SunTree5]: {
    element: Element.Sun,
    cost: 2,
    bonus: {
      element: Element.Water,
      river: {
        north: false,
        east: true,
        south: true,
        west: true
      }
    }
  },
  [Tree.SunTree6]: {
    element: Element.Sun,
    cost: 2,
    bonus: {
      element: Element.Wind,
      river: {
        north: true,
        east: true,
        south: false,
        west: true  
      }
    }
  },
  [Tree.WaterTree1]: {
    element: Element.Water,
    cost: 2,
    bonus: {
      element: Element.Wind,
      river: {
        north: false,
        east: true,
        south: false,
        west: true
      }
    }
  },
  [Tree.WaterTree2]: {
    element: Element.Water,
    cost: 2,
    bonus: {
      element: Element.Wind,
      river: {
        north: true,
        east: false,
        south: true,
        west: false
      }
    }
  },
  [Tree.WaterTree3]: {
    element: Element.Water,
    cost: 3,
    bonus: {
      element: Element.Water,
      river: {
        north: true,
        east: true,
        south: true,
        west: false
      }
    }
  },
  [Tree.WaterTree4]: {
    element: Element.Water,
    cost: 3,
    bonus: {
      element: Element.Sun,
      river: {
        north: true,
        east: false,
        south: true,
        west: true
      }
    }
  },
  [Tree.WaterTree5]: {
    element: Element.Water,
    cost: 3,
    bonus: {
      element: Element.Wind,
      river: {
        north: false,
        east: true,
        south: true,
        west: true  
      }
    }
  },
  [Tree.WaterTree6]: {
    element: Element.Water,
    cost: 3,
    bonus: {
      element: Element.Sun,
      river: {
        north: true,
        east: true,
        south: false,
        west: true  
      }
    }
  },
  [Tree.PlantTree1]: {
    element: Element.Plant,
    cost: 4,
    bonus: {
      element: Element.Wind,
      river: {
        north: true,
        east: false,
        south: true,
        west: false
      }
    }
  },
  [Tree.PlantTree2]: {
    element: Element.Plant,
    cost: 4,
    bonus: {
      element: Element.Wind,
      river: {
        north: false,
        east: true,
        south: false,
        west: true
      }
    }
  },
  [Tree.PlantTree3]: {
    element: Element.Plant,
    cost: 4,
    bonus: {
      element: Element.Sun,
      river: {
        north: false,
        east: false,
        south: true,
        west: true
      }
    }
  },
  [Tree.PlantTree4]: {
    element: Element.Plant,
    cost: 4,
    bonus: {
      element: Element.Water,
      river: {
        north: true,
        east: true,
        south: false,
        west: false
      }
    }
  },
  [Tree.PlantTree5]: {
    element: Element.Plant,
    cost: 5,
    bonus: {
      element: Element.Wind,
      river: {
        north: false,
        east: true,
        south: true,
        west: false  
      }
    }
  },
  [Tree.PlantTree6]: {
    element: Element.Plant,
    cost: 5,
    bonus: {
      element: Element.Wind,
      river: {
        north: true,
        east: false,
        south: false,
        west: true  
      }
    }
  },
  [Tree.WindTree1]: {
    element: Element.Wind,
    cost: 4,
    bonus: {
      element: Element.Wind,
      river: {
        north: true,
        east: false,
        south: true,
        west: true
      }
    }
  },
  [Tree.WindTree2]: {
    element: Element.Wind,
    cost: 4,
    bonus: {
      element: Element.Wind,
      river: {
        north: true,
        east: true,
        south: true,
        west: false
      }
    }
  },
  [Tree.WindTree3]: {
    element: Element.Wind,
    cost: 3,
    bonus: {
      element: Element.Sun,
      river: {
        north: true,
        east: true,
        south: false,
        west: false
      }
    }
  },
  [Tree.WindTree4]: {
    element: Element.Wind,
    cost: 3,
    bonus: {
      element: Element.Sun,
      river: {
        north: false,
        east: false,
        south: true,
        west: true
      }
    }
  },
  [Tree.WindTree5]: {
    element: Element.Wind,
    cost: 3,
    bonus: {
      element: Element.Water,
      river: {
        north: false,
        east: true,
        south: true,
        west: false  
      }
    }
  },
  [Tree.WindTree6]: {
    element: Element.Wind,
    cost: 3,
    bonus: {
      element: Element.Water,
      river: {
        north: false,
        east: false,
        south: true,
        west: true  
      }
    }
  }
}

export const getTreeSeason = (tree: Tree) => tree < 3 ? tree % 10 : null
export const getTreeType = (tree: Tree) => Math.floor(tree / 100) + 1

export const treeCards = getEnumValues(Tree).filter(tree => tree >= 101)
export const treeTypes = getEnumValues(TreeType)
