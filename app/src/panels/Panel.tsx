/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import { LocationType } from '@gamepark/living-forest-duel/material/LocationType'
import { MaterialType } from '@gamepark/living-forest-duel/material/MaterialType'
import { AnimalsHelper } from '@gamepark/living-forest-duel/rules/helpers/AnimalsHelper'
import { ElementsHelper } from '@gamepark/living-forest-duel/rules/helpers/ElementsHelper'
import { Element, Season } from '@gamepark/living-forest-duel/Season'
import { Player } from '@gamepark/react-client'
import { CounterProps, StyledPlayerPanel, useGame } from '@gamepark/react-game'
import { MaterialGame } from '@gamepark/rules-api'
import SummerBackground from '../images/backgrounds/SummerBackground.jpg'
import WinterBackground from '../images/backgrounds/WinterBackground.jpg'
import Plant from '../images/icons/Plant.png'
import Solitary from '../images/icons/Solitary.png'
import Sun from '../images/icons/Sun.png'
import Water from '../images/icons/Water.png'
import Wind from '../images/icons/Wind.png'
import Fire from '../images/tokens/Fire.png'

type PanelProps = {
  player: Player<Season>
}

export const Panel = ({ player }: PanelProps) => {
  const game = useGame<MaterialGame>()!
  const elementsHelper = new ElementsHelper(game, player.id)
  const animalsHelper = new AnimalsHelper(game)

  const counters: CounterProps[] = [
    { image: Sun, value: elementsHelper.getElementValue(Element.Sun) },
    { image: Water, value: elementsHelper.getElementValue(Element.Water) },
    { image: Solitary, value: animalsHelper.countSolitary(player.id) },
    { image: Plant, value: elementsHelper.getElementValue(Element.Plant) },
    { image: Wind, value: elementsHelper.getElementValue(Element.Wind) },
    { image: Fire, value: elementsHelper.material(MaterialType.FireToken).location(LocationType.PlayerFireStock).player(player.id).getQuantity() }
  ]

  return <StyledPlayerPanel player={player} color={playerColorCode[player.id]} counters={counters} countersPerLine={3}
                            backgroundImage={player.id === Season.Summer ? SummerBackground : WinterBackground}
                            css={[panelCss, player.id === Season.Summer ? left : right]}/>
}

const panelCss = css`
  position: absolute;
  transform: translateY(50%) translateY(60em);
  width: 35em;
`

const left = css`
  left: 3em
`

const right = css`
  right: 3em
`

export const playerColorCode: Record<Season, string> = {
  [Season.Summer]: '#D1B93D',
  [Season.Winter]: '#64467A'
}