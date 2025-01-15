import { LocationType } from '@gamepark/living-forest-duel/material/LocationType'
import { Tree } from '@gamepark/living-forest-duel/material/Tree'
import { Element } from '@gamepark/living-forest-duel/Season'
import { CardDescription } from '@gamepark/react-game'
import { MaterialItem } from '@gamepark/rules-api'
import PlantTree1 from '../images/cards/trees/PlantTree1.jpg'
import PlantTree2 from '../images/cards/trees/PlantTree2.jpg'
import PlantTree3 from '../images/cards/trees/PlantTree3.jpg'
import PlantTree4 from '../images/cards/trees/PlantTree4.jpg'
import PlantTree5 from '../images/cards/trees/PlantTree5.jpg'
import PlantTree6 from '../images/cards/trees/PlantTree6.jpg'
import PlantTreeBack from '../images/cards/trees/PlantTreeBack.jpg'
import SummerStartingTree from '../images/cards/trees/SummerStartingTree.jpg'
import SunTree1 from '../images/cards/trees/SunTree1.jpg'
import SunTree2 from '../images/cards/trees/SunTree2.jpg'
import SunTree3 from '../images/cards/trees/SunTree3.jpg'
import SunTree4 from '../images/cards/trees/SunTree4.jpg'
import SunTree5 from '../images/cards/trees/SunTree5.jpg'
import SunTree6 from '../images/cards/trees/SunTree6.jpg'
import SunTreeBack from '../images/cards/trees/SunTreeBack.jpg'
import WaterTree1 from '../images/cards/trees/WaterTree1.jpg'
import WaterTree2 from '../images/cards/trees/WaterTree2.jpg'
import WaterTree3 from '../images/cards/trees/WaterTree3.jpg'
import WaterTree4 from '../images/cards/trees/WaterTree4.jpg'
import WaterTree5 from '../images/cards/trees/WaterTree5.jpg'
import WaterTree6 from '../images/cards/trees/WaterTree6.jpg'
import WaterTreeBack from '../images/cards/trees/WaterTreeBack.jpg'
import WindTree1 from '../images/cards/trees/WindTree1.jpg'
import WindTree2 from '../images/cards/trees/WindTree2.jpg'
import WindTree3 from '../images/cards/trees/WindTree3.jpg'
import WindTree4 from '../images/cards/trees/WindTree4.jpg'
import WindTree5 from '../images/cards/trees/WindTree5.jpg'
import WindTree6 from '../images/cards/trees/WindTree6.jpg'
import WindTreeBack from '../images/cards/trees/WindTreeBack.jpg'
import WinterStartingTree from '../images/cards/trees/WinterStartingTree.jpg'
import { TreeCardHelp } from './help/TreeCardHelp'

class TreeCardDescription extends CardDescription {
  width = 8.8
  height = 6.3
  borderRadius = 0.5

  backImages = {
    [Element.Sun]: SunTreeBack,
    [Element.Water]: WaterTreeBack,
    [Element.Plant]: PlantTreeBack,
    [Element.Wind]: WindTreeBack
  }

  images = {
    [Tree.SummerStartingTree]: SummerStartingTree,
    [Tree.WinterStartingTree]: WinterStartingTree,
    [Tree.PlantTree1]: PlantTree1,
    [Tree.PlantTree2]: PlantTree2,
    [Tree.PlantTree3]: PlantTree3,
    [Tree.PlantTree4]: PlantTree4,
    [Tree.PlantTree5]: PlantTree5,
    [Tree.PlantTree6]: PlantTree6,
    [Tree.SunTree1]: SunTree1,
    [Tree.SunTree2]: SunTree2,
    [Tree.SunTree3]: SunTree3,
    [Tree.SunTree4]: SunTree4,
    [Tree.SunTree5]: SunTree5,
    [Tree.SunTree6]: SunTree6,
    [Tree.WaterTree1]: WaterTree1,
    [Tree.WaterTree2]: WaterTree2,
    [Tree.WaterTree3]: WaterTree3,
    [Tree.WaterTree4]: WaterTree4,
    [Tree.WaterTree5]: WaterTree5,
    [Tree.WaterTree6]: WaterTree6,
    [Tree.WindTree1]: WindTree1,
    [Tree.WindTree2]: WindTree2,
    [Tree.WindTree3]: WindTree3,
    [Tree.WindTree4]: WindTree4,
    [Tree.WindTree5]: WindTree5,
    [Tree.WindTree6]: WindTree6
  }

  help = TreeCardHelp

  isFlipped(item: Partial<MaterialItem>) {
    return item.location?.type === LocationType.TreeDeckSpot && item.location.rotation
  }
}

export const treeCardDescription = new TreeCardDescription()