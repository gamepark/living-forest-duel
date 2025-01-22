import { css } from '@emotion/react'
import { ClotheType, FacialHairType, TopType } from '@gamepark/avataaars'
import ClotheColorName from '@gamepark/avataaars/dist/avatar/clothes/ClotheColorName'
import HatColorName from '@gamepark/avataaars/dist/avatar/top/HatColorName'
import { Animal } from '@gamepark/living-forest-duel/material/Animal'
import { LocationType } from '@gamepark/living-forest-duel/material/LocationType'
import { MaterialType } from '@gamepark/living-forest-duel/material/MaterialType'
import { SpiritType } from '@gamepark/living-forest-duel/material/SpiritType'
import { Tree, TreeId } from '@gamepark/living-forest-duel/material/Tree'
import { CustomMoveType } from '@gamepark/living-forest-duel/rules/CustomMoveType'
import { Element, Season } from '@gamepark/living-forest-duel/Season'
import { MaterialTutorial, Picture, TutorialStep } from '@gamepark/react-game'
import { isCustomMoveType, isMoveItemType, MaterialGame, MaterialMove } from '@gamepark/rules-api'
import { Trans } from 'react-i18next'
import Plant from '../images/icons/Plant.png'
import Solitary from '../images/icons/Solitary.png'
import Sun from '../images/icons/Sun.png'
import Water from '../images/icons/Water.png'
import Wind from '../images/icons/Wind.png'
import { clearingCardDescription } from '../material/ClearingCardDescription'
import { treeTokenDescription } from '../material/TreeTokenDescription'
import { TutorialSetup } from './TutorialSetup'

const me = Season.Summer
const winter = Season.Winter

export class Tutorial extends MaterialTutorial<Season, MaterialType, LocationType> {
  version = 1
  options = {
    player: [{ id: me }, { id: winter }]
  }
  setup = new TutorialSetup()

  players = [{ id: me },
    {
      id: winter,
      name: 'Winter',
      avatar: {
        topType: TopType.WinterHat3,
        hatColor: HatColorName.Red,
        facialHairType: FacialHairType.BeardMajestic,
        clotheType: ClotheType.Hoodie,
        clotheColor: ClotheColorName.Red
      }
    }]

  steps: TutorialStep[] = [
    {
      popup: {
        text: () => <Trans defaults="tuto.welcome" components={{ bold: <strong/> }}/>
      }
    },
    {
      popup: {
        text: () => <Trans defaults="tuto.seasons" components={{ bold: <strong/> }}/>
      },
      focus: () => ({
        staticItems: { [MaterialType.TreeToken]: treeTokenDescription.staticItems }
      })
    },
    {
      popup: {
        text: () => <Trans defaults="tuto.turn" components={{ bold: <strong/> }}/>,
        position: { x: 20, y: 20 }
      },
      focus: (game: MaterialGame) => ({
        materials: [
          this.material(game, MaterialType.AnimalCard).location(LocationType.SharedDeck).maxBy(item => item.location.x!),
          this.material(game, MaterialType.ActionToken).id(Season.Summer)
        ],
        margin: { bottom: 3, top: 3, right: 20 }
      })
    },
    {
      popup: {
        text: () => <Trans defaults="tuto.animals" components={{ bold: <strong/> }}/>,
        position: { x: 20, y: 20 }
      },
      focus: (game: MaterialGame) => ({
        materials: [
          this.material(game, MaterialType.AnimalCard).location(LocationType.SharedDeck).maxBy(item => item.location.x!)
        ],
        margin: { bottom: 15, top: 3, right: 20 }
      }),
      move: {}
    },
    {
      popup: {
        text: () => <Trans defaults="tuto.line.common" components={{ bold: <strong/> }}/>,
        position: { x: 20, y: 20 }
      },
      focus: (game: MaterialGame) => ({
        materials: [
          this.material(game, MaterialType.AnimalCard).location(LocationType.SharedHelpLine)
        ],
        margin: { bottom: 15, top: 3, right: 5 }
      })
    },
    {
      popup: {
        text: () => <Trans defaults="tuto.opponent.turn" components={{ bold: <strong/> }}/>
      }
    },
    {
      move: { player: winter, filter: isMoveItemType(MaterialType.AnimalCard) }
    },
    {
      popup: {
        text: () => <Trans defaults="tuto.draw" components={{ bold: <strong/> }}/>,
        position: { y: 20 }
      },
      focus: (game: MaterialGame) => ({
        materials: [
          this.material(game, MaterialType.AnimalCard).location(LocationType.SharedHelpLine).maxBy(item => item.location.x!)
        ],
        margin: { bottom: 15, top: 3 }
      })
    },
    {
      popup: {
        text: () => <Trans defaults="tuto.tokens" components={{ bold: <strong/> }}/>,
        position: { x: 20 }
      },
      focus: (game: MaterialGame) => ({
        materials: [
          this.material(game, MaterialType.ActionToken).id(Season.Summer)
        ],
        margin: { bottom: 3, top: 3, right: 20 }
      })
    },
    {
      popup: {
        text: () => <Trans defaults="tuto.action" components={{
          bold: <strong/>,
          sun: <Picture css={iconCss} src={Sun}/>,
          water: <Picture css={iconCss} src={Water}/>,
          plant: <Picture css={iconCss} src={Plant}/>,
          wind: <Picture css={iconCss} src={Wind}/>
        }}/>,
        position: { x: 10, y: 20 }
      },
      focus: (game: MaterialGame) => ({
        materials: [
          this.material(game, MaterialType.AnimalCard).location(LocationType.SharedHelpLine)
        ],
        margin: { bottom: 15, top: 3, left: 10 }
      })
    },
    {
      popup: {
        text: () => <Trans defaults="tuto.sun" components={{
          bold: <strong/>,
          sun: <Picture css={iconCss} src={Sun}/>
        }}/>,
        position: { x: 10, y: 20 }
      },
      focus: (game: MaterialGame) => ({
        materials: [
          this.material(game, MaterialType.AnimalCard).location(LocationType.SharedHelpLine)
        ],
        margin: { bottom: 15, top: 3, left: 10 }
      }),
      move: { filter: move => isMoveItemType(MaterialType.ActionToken)(move) && move.location.id === Element.Sun }
    },
    {
      popup: {
        text: () => <Trans defaults="tuto.action.recruit" components={{
          bold: <strong/>,
          sun: <Picture css={iconCss} src={Sun}/>
        }}/>,
        position: { y: 20 }
      },
      focus: (game: MaterialGame) => ({
        materials: [
          this.material(game, MaterialType.AnimalCard).location(LocationType.RecruitmentLine)
        ],
        margin: { bottom: 15, top: 3, left: 5, right: 5 }
      })
    },
    {
      popup: {
        text: () => <Trans defaults="tuto.animal.cost" components={{ bold: <strong/> }}/>,
        position: { y: 20 }
      },
      focus: (game: MaterialGame) => ({
        locations: this.material(game, MaterialType.AnimalCard).location(LocationType.RecruitmentLine).getIndexes().map(parent => ({
          type: LocationType.AnimalCost, parent
        })),
        margin: { bottom: 15, top: 10, left: 8, right: 5 }
      })
    },
    {
      popup: {
        text: () => <Trans defaults="tuto.recruit" components={{
          bold: <strong/>,
          sun: <Picture css={iconCss} src={Sun}/>
        }}/>,
        position: { x: 30, y: -15 }
      },
      focus: (game: MaterialGame) => ({
        materials: [
          this.material(game, MaterialType.AnimalCard).id(Animal.Hummingbird)
        ],
        margin: { bottom: 23, top: 3, right: 20 }
      }),
      move: {
        filter: (move, game) => isMoveItemType(MaterialType.AnimalCard)(move)
          && this.material(game, MaterialType.AnimalCard).getItem<Animal>(move.itemIndex).id === Animal.Hummingbird
      }
    },
    {
      popup: {
        text: () => <Trans defaults="tuto.animal.season" components={{ bold: <strong/> }}/>,
        position: { x: 10, y: 10 }
      },
      focus: (game: MaterialGame) => ({
        locations: this.material(game, MaterialType.AnimalCard)
          .location(l => l.type === LocationType.RecruitmentLine || l.type === LocationType.PlayerHelpLine).getIndexes().map(parent => ({
            type: LocationType.AnimalSeason, parent
          })),
        margin: { top: 9, bottom: 1, left: 3 }
      })
    },
    {
      popup: {
        text: () => <Trans defaults="tuto.neutral" components={{ bold: <strong/> }}/>,
        position: { y: 20 }
      },
      focus: (game: MaterialGame) => ({
        materials: [
          this.material(game, MaterialType.AnimalCard).location(LocationType.SharedDeck),
          this.material(game, MaterialType.AnimalCard).location(LocationType.SharedHelpLine),
          this.material(game, MaterialType.AnimalCard).id(Animal.Stag)
        ],
        margin: { bottom: 23, top: 3, right: 15 }
      })
    },
    {
      popup: {
        text: () => <Trans defaults="tuto.line.mine" components={{ bold: <strong/> }}/>,
        position: { x: 35 }
      },
      focus: (game: MaterialGame) => ({
        staticItems: { [MaterialType.TreeToken]: treeTokenDescription.staticItems.filter(item => item.id === Season.Summer) },
        materials: [
          this.material(game, MaterialType.AnimalCard).id(Animal.Hummingbird)
        ],
        margin: { bottom: 3, top: 15, right: 30, left: 10 }
      })
    },
    {
      popup: {
        text: () => <Trans defaults="tuto.recruit.ram" components={{ bold: <strong/> }}/>,
        position: { x: 20, y: 10 }
      },
      focus: (game: MaterialGame) => ({
        materials: [
          this.material(game, MaterialType.AnimalCard).id(Animal.Ram)
        ],
        margin: { bottom: 25, top: 2, left: 30 }
      }),
      move: {
        filter: (move, game) => isMoveItemType(MaterialType.AnimalCard)(move)
          && this.material(game, MaterialType.AnimalCard).getItem<Animal>(move.itemIndex).id === Animal.Ram
      }
    },
    {
      popup: {
        text: () => <Trans defaults="tuto.action.pass" components={{ bold: <strong/> }}/>,
        position: { y: 20 }
      },
      move: {
        filter: isCustomMoveType(CustomMoveType.Pass)
      }
    },
    {
      popup: {
        text: () => <Trans defaults="tuto.replace" components={{ bold: <strong/> }}/>,
        position: { y: 20 }
      }
    },
    {
      popup: {
        text: () => <Trans defaults="tuto.sun.win" components={{
          bold: <strong/>,
          sun: <Picture css={iconCss} src={Sun}/>,
          italic: <em/>
        }}/>,
        position: { y: 15 }
      },
      focus: (game: MaterialGame) => ({
        materials: [
          this.material(game, MaterialType.AnimalCard).location(LocationType.RecruitmentLine)
        ],
        margin: { bottom: 25, top: 2 }
      })
    },
    {
      popup: {
        text: () => <Trans defaults="tuto.opponent.turn" components={{ bold: <strong/> }}/>,
        position: { y: -20 }
      }
    },
    {
      move: { player: winter, filter: isMoveItemType(MaterialType.AnimalCard) }
    },
    {
      popup: {
        text: () => <Trans defaults="tuto.solitary" components={{
          bold: <strong/>,
          solitary: <Picture css={iconCss} src={Solitary}/>,
          italic: <em/>
        }}/>,
        position: { x: 30 }
      },
      focus: (game: MaterialGame) => ({
        materials: [
          this.material(game, MaterialType.AnimalCard).id(Animal.Bear)
        ],
        margin: { left: 10, right: 25, top: 5, bottom: 5 }
      })
    },
    {
      popup: {
        text: () => <Trans defaults="tuto.draw.you" components={{ bold: <strong/> }}/>,
        position: { y: 20 }
      },
      focus: (game: MaterialGame) => ({
        materials: [
          this.material(game, MaterialType.AnimalCard).location(LocationType.SharedDeck).maxBy(item => item.location.x!)
        ],
        margin: { left: 10, right: 40, top: 5, bottom: 20 }
      }),
      move: { filter: isMoveItemType(MaterialType.AnimalCard) }
    },
    {
      popup: {
        text: () => <Trans defaults="tuto.solitary.2" components={{
          bold: <strong/>,
          solitary: <Picture css={iconCss} src={Solitary}/>,
          italic: <em/>
        }}/>,
        position: { y: 20 }
      },
      focus: (game: MaterialGame) => ({
        materials: [
          this.material(game, MaterialType.AnimalCard).id(Animal.Lynx)
        ],
        margin: { left: 30, right: 10, top: 5, bottom: 20 }
      })
    },
    {
      popup: {
        text: () => <Trans defaults="tuto.opponent.turn" components={{ bold: <strong/> }}/>,
        position: { y: -20 }
      }
    },
    {
      move: {
        player: winter,
        filter: (move: MaterialMove) => isMoveItemType(MaterialType.ActionToken)(move) && move.location.id === Element.Water
      }
    },
    {
      popup: {
        text: () => <Trans defaults="tuto.extinguish" components={{
          bold: <strong/>,
          water: <Picture css={iconCss} src={Water}/>
        }}/>,
        position: { y: 20 }
      },
      focus: (game: MaterialGame) => ({
        materials: [
          this.material(game, MaterialType.ActionToken).id(Season.Winter).location(LocationType.PointElement),
          this.material(game, MaterialType.AnimalCard).location(LocationType.SharedHelpLine)
        ],
        margin: { left: 5, right: 5, top: 5, bottom: 15 }
      })
    },
    {
      popup: {
        text: () => <Trans defaults="tuto.fire" components={{ bold: <strong/> }}/>,
        position: { y: 20 }
      },
      focus: (game: MaterialGame) => ({
        materials: [
          this.material(game, MaterialType.FireToken).location(LocationType.ClearingCardSpot)
        ],
        margin: { left: 5, right: 5, top: 5, bottom: 15 }
      })
    },
    {
      popup: {
        text: () => <Trans defaults="tuto.fire.cost" components={{
          bold: <strong/>,
          water: <Picture css={iconCss} src={Water}/>
        }}/>,
        position: { y: 10 }
      },
      focus: (game: MaterialGame) => ({
        staticItems: { [MaterialType.ClearingCard]: clearingCardDescription.staticItems },
        materials: [
          this.material(game, MaterialType.FireToken).location(LocationType.ClearingCardSpot)
        ],
        margin: { left: 5, right: 5, top: 5, bottom: 40 }
      })
    },
    {
      move: {
        player: winter,
        filter: isMoveItemType(MaterialType.FireToken)
      }
    },
    {
      move: {
        player: winter,
        filter: isMoveItemType(MaterialType.FireToken)
      }
    },
    {
      move: {
        player: winter,
        filter: isCustomMoveType(CustomMoveType.Pass)
      }
    },
    {
      popup: {
        text: () => <Trans defaults="tuto.water.win" components={{
          bold: <strong/>,
          water: <Picture css={iconCss} src={Water}/>
        }}/>,
        position: { y: -20 }
      },
      focus: (game: MaterialGame) => ({
        materials: [
          this.material(game, MaterialType.FireToken).location(LocationType.PlayerFireStock)
        ],
        margin: { left: 5, right: 5, top: 20, bottom: 2 }
      })
    },
    {
      popup: {
        text: () => <Trans defaults="tuto.action.plant" components={{
          bold: <strong/>,
          plant: <Picture css={iconCss} src={Plant}/>
        }}/>,
        position: { x: 20, y: 20 }
      },
      focus: (game: MaterialGame) => ({
        materials: [
          this.material(game, MaterialType.AnimalCard).location(LocationType.SharedHelpLine),
          this.material(game, MaterialType.ActionToken).id(me).location(LocationType.PlayerActionSupply)
        ],
        margin: { bottom: 3, top: 3, left: 15, right: 10 }
      }),
      move: { filter: move => isMoveItemType(MaterialType.ActionToken)(move) && move.location.id === Element.Plant }
    },
    {
      popup: {
        text: () => <Trans defaults="tuto.trees" components={{ bold: <strong/> }}/>,
        position: { y: 20 }
      },
      focus: (game: MaterialGame) => ({
        materials: [
          this.material(game, MaterialType.TreeCard).location(LocationType.TreeDeckSpot)
        ],
        margin: { bottom: 15, top: 3, left: 5, right: 5 }
      })
    },
    {
      popup: {
        text: () => <Trans defaults="tuto.tree.cost" components={{ bold: <strong/> }}/>,
        position: { y: 20 }
      },
      focus: (game: MaterialGame) => ({
        locations: this.material(game, MaterialType.TreeCard).location(LocationType.TreeDeckSpot).rotation(false).getIndexes().map(parent => ({
          type: LocationType.TreeCost, parent
        })),
        margin: { bottom: 15, top: 10, left: 12, right: 5 }
      })
    },
    {
      popup: {
        text: () => <Trans defaults="tuto.tree.start" components={{ bold: <strong/> }}/>,
        position: { x: 20 }
      },
      focus: (game: MaterialGame) => ({
        materials: [this.material(game, MaterialType.TreeCard).id<TreeId>(id => id.front === Tree.SummerStartingTree)],
        margin: { bottom: 15, top: 10, left: 5, right: 30 }
      })
    },
    {
      popup: {
        text: () => <Trans defaults="tuto.plant" components={{
          bold: <strong/>,
          plant: <Picture css={iconCss} src={Plant}/>,
          italic: <em/>
        }}/>,
        position: { x: 20 }
      },
      focus: (game: MaterialGame) => ({
        materials: [
          this.material(game, MaterialType.TreeCard).id<TreeId>(id => id.front === Tree.SummerStartingTree),
          this.material(game, MaterialType.TreeCard).id<TreeId>(id => id.front === Tree.SunTree5)
        ],
        margin: { bottom: 15, top: 10, left: 5, right: 30 }
      }),
      move: {
        filter: (move: MaterialMove, game: MaterialGame) =>
          isMoveItemType(MaterialType.TreeCard)(move)
          && move.itemIndex === this.material(game, MaterialType.TreeCard).id<TreeId>(id => id.front === Tree.SunTree5).getIndex()
      }
    },
    {
      popup: {
        text: () => <Trans defaults="tuto.tree.element" components={{
          bold: <strong/>,
          sun: <Picture css={iconCss} src={Sun}/>,
          italic: <em/>
        }}/>,
        position: { x: 20 }
      },
      focus: (game: MaterialGame) => ({
        locations: [{
          type: LocationType.TreeElement,
          parent: this.material(game, MaterialType.TreeCard).id<TreeId>(id => id.front === Tree.SunTree5).getIndex()
        }],
        margin: { bottom: 15, top: 10, left: 5, right: 30 }
      })
    },
    {
      popup: {
        text: () => <Trans defaults="tuto.tree.bonus" components={{
          bold: <strong/>,
          water: <Picture css={iconCss} src={Water}/>
        }}/>,
        position: { x: 20 }
      },
      focus: (game: MaterialGame) => ({
        materials: [
          this.material(game, MaterialType.TreeCard).id<TreeId>(id => id.front === Tree.SunTree5)
        ],
        margin: { bottom: 15, top: 10, left: 5, right: 30 }
      })
    },
    {
      popup: {
        text: () => <Trans defaults="tuto.plant.win" components={{
          bold: <strong/>,
          plant: <Picture css={iconCss} src={Plant}/>
        }}/>,
        position: { x: 20 }
      },
      focus: (game: MaterialGame) => ({
        materials: [
          this.material(game, MaterialType.TreeCard).location(LocationType.PlayerForest).player(me)
        ],
        margin: { bottom: 15, top: 10, left: 5, right: 30 }
      })
    },
    {
      popup: {
        text: () => <Trans defaults="tuto.action.pass" components={{ bold: <strong/> }}/>
      },
      move: { filter: isCustomMoveType(CustomMoveType.Pass) }
    },
    {
      popup: {
        text: () => <Trans defaults="tuto.turn.over" components={{ bold: <strong/> }}/>
      }
    },
    {
      popup: {
        text: () => <Trans defaults="tuto.solitary.3" components={{
          bold: <strong/>,
          solitary: <Picture css={iconCss} src={Solitary}/>
        }}/>,
        position: { y: 20 }
      },
      focus: (game: MaterialGame) => ({
        materials: [
          this.material(game, MaterialType.AnimalCard).location(LocationType.SharedHelpLine)
        ],
        margin: { bottom: 20, top: 3, left: 10, right: 3 }
      })
    },
    {
      move: {
        player: winter,
        filter: move => isMoveItemType(MaterialType.ActionToken)(move) && move.location.id === Element.Wind
      }
    },
    {
      popup: {
        text: () => <Trans defaults="tuto.action.wind" components={{
          bold: <strong/>,
          wind: <Picture css={iconCss} src={Wind}/>
        }}/>,
        position: { y: 20 }
      },
      focus: (game: MaterialGame) => ({
        materials: [
          this.material(game, MaterialType.ActionToken).locationId(Element.Wind)
        ],
        margin: { bottom: 15, top: 7, left: 10, right: 10 }
      })
    },
    {
      popup: {
        text: () => <Trans defaults="tuto.onibi" components={{
          bold: <strong/>,
          wind: <Picture css={iconCss} src={Wind}/>
        }}/>,
        position: { y: 20 }
      },
      focus: (game: MaterialGame) => ({
        materials: [
          this.material(game, MaterialType.OnibiStandee)
        ],
        margin: { bottom: 20, top: 5, left: 10, right: 10 }
      })
    },
    {
      move: {
        player: winter,
        filter: (move: MaterialMove) => isCustomMoveType(CustomMoveType.MoveOnibi)(move) && move.data === 3,
        interrupt: isMoveItemType(MaterialType.SpiritCard)
      }
    },
    {
      popup: {
        text: () => <Trans defaults="tuto.wind.bonus" components={{ bold: <strong/> }}/>,
        position: { y: 20 }
      },
      focus: () => ({
        locations: [{ type: LocationType.ClearingCardBonus, x: -3 }],
        margin: { bottom: 15, top: 10, left: 10, right: 10 }
      })
    },
    {
      popup: {
        text: () => <Trans defaults="tuto.bonus.sanki" components={{ bold: <strong/> }}/>,
        position: { y: 10 }
      },
      focus: (game: MaterialGame) => ({
        materials: [this.material(game, MaterialType.SpiritCard).id(SpiritType.Sanki)],
        locations: [{ type: LocationType.ClearingCardBonus, x: -3 }],
        margin: { bottom: 35, top: 3, left: 5, right: 5 }
      }),
      move: {
        interrupt: isMoveItemType(MaterialType.AnimalCard)
      }
    },
    {
      popup: {
        text: () => <Trans defaults="tuto.onibi.card" components={{ bold: <strong/> }}/>,
        position: { y: 20 }
      },
      focus: (game: MaterialGame) => ({
        materials: [
          this.material(game, MaterialType.OnibiStandee),
          this.material(game, MaterialType.SpiritCard).id(SpiritType.Onibi)
        ],
        staticItems: { [MaterialType.ClearingCard]: clearingCardDescription.staticItems.filter(item => Math.abs(item.location.x!) === 3) },
        margin: { bottom: 15, top: 3, left: 5, right: 5 }
      })
    },
    {
      popup: {
        text: () => <Trans defaults="tuto.wind.win" components={{
          bold: <strong/>,
          wind: <Picture css={iconCss} src={Wind}/>
        }}/>
      }
    },
    {
      popup: {
        text: () => <Trans defaults="tuto.varan" components={{ bold: <strong/> }}/>
      },
      focus: (game: MaterialGame) => ({
        materials: [
          this.material(game, MaterialType.AnimalCard).location(LocationType.VaranDeck)
        ],
        margin: { bottom: 15, top: 3, left: 5, right: 5 }
      })
    },
    {
      popup: {
        text: () => <Trans defaults="tuto.fire.value" components={{ bold: <strong/> }}/>,
        position: { y: 20 }
      },
      focus: (game: MaterialGame) => ({
        materials: [
          this.material(game, MaterialType.OnibiStandee)
        ],
        staticItems: { [MaterialType.ClearingCard]: clearingCardDescription.staticItems.filter(item => item.location.x === -3) },
        margin: { bottom: 20, top: 3, left: 5, right: 5 }
      })
    },
    {
      popup: {
        text: () => <Trans defaults="tuto.water.value" components={{
          bold: <strong/>,
          water: <Picture css={iconCss} src={Water}/>
        }}/>,
        position: { y: -20 }
      },
      focus: (game: MaterialGame) => ({
        materials: [
          this.material(game, MaterialType.AnimalCard).location(LocationType.SharedHelpLine),
          this.material(game, MaterialType.AnimalCard).location(LocationType.PlayerHelpLine),
          this.material(game, MaterialType.TreeCard).location(LocationType.PlayerForest),
          this.material(game, MaterialType.ActionToken).location(LocationType.PointElement).locationId(Element.Water)
        ],
        margin: { bottom: 5, top: 20, left: 5, right: 5 }
      })
    },
    {
      popup: {
        text: () => <Trans defaults="tuto.varan.get" components={{
          bold: <strong/>,
          water: <Picture css={iconCss} src={Water}/>
        }}/>
      },
      move: {
        interrupt: isMoveItemType(MaterialType.FireToken)
      }
    },
    {
      popup: {
        text: () => <Trans defaults="tuto.varan.detail" components={{
          bold: <strong/>,
          solitary: <Picture css={iconCss} src={Solitary}/>
        }}/>,
        position: { x: 20, y: -5 }
      },
      focus: (game: MaterialGame) => ({
        materials: [
          this.material(game, MaterialType.AnimalCard).location(LocationType.SharedDiscardPile)
        ],
        margin: { bottom: 10, top: 5, left: 5, right: 30 }
      })
    },
    {
      popup: {
        text: () => <Trans defaults="tuto.sanki.varan" components={{ bold: <strong/> }}/>
      },
      focus: (game: MaterialGame) => ({
        materials: [
          this.material(game, MaterialType.SpiritCard).id(SpiritType.Sanki)
        ],
        margin: { bottom: 5, top: 5, left: 5, right: 5 }
      })
    },
    {
      popup: {
        text: () => <Trans defaults="tuto.sanki.replay" components={{ bold: <strong/> }}/>
      },
      focus: (game: MaterialGame) => ({
        materials: [
          this.material(game, MaterialType.SpiritCard).id(SpiritType.Sanki)
        ],
        margin: { bottom: 5, top: 5, left: 5, right: 5 }
      })
    },
    {
      popup: {
        text: () => <Trans defaults="tuto.fire.put" components={{ bold: <strong/> }}/>,
        position: { y: 20 }
      },
      focus: (game: MaterialGame) => ({
        materials: [
          this.material(game, MaterialType.OnibiStandee),
          this.material(game, MaterialType.FireToken).location(LocationType.FireStock)
        ],
        staticItems: { [MaterialType.ClearingCard]: clearingCardDescription.staticItems.filter(item => item.location.x === -2 || item.location.x === 3) },
        margin: { bottom: 20, top: 5, left: 5, right: 5 }
      }),
      move: {
        interrupt: isMoveItemType(MaterialType.ActionToken)
      }
    },
    {
      popup: {
        text: () => <Trans defaults="tuto.turn.new" components={{ bold: <strong/> }}/>
      },
      move: {}
    },
    {
      popup: {
        text: () => <Trans defaults="tuto.win.conditions" components={{
          bold: <strong/>,
          sun: <Picture css={iconCss} src={Sun}/>,
          water: <Picture css={iconCss} src={Water}/>,
          plant: <Picture css={iconCss} src={Plant}/>,
          wind: <Picture css={iconCss} src={Wind}/>
        }}/>
      }
    },
    {
      popup: {
        text: () => <Trans defaults="tuto.remind" components={{ bold: <strong/> }}/>
      }
    }
  ]
}

const iconCss = css`
  vertical-align: sub;
  height: 1.2em;
`
