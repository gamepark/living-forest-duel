/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import { TreesHelper } from '@gamepark/living-forest-duel/rules/helpers/TreesHelper'
import { Season } from '@gamepark/living-forest-duel/Season'
import { GameTable, GameTableNavigation } from '@gamepark/react-game'
import { MaterialGame } from '@gamepark/rules-api'
import { playerForestLocator } from './locators/PlayerForestLocator'
import { PlayerPanels } from './panels/PlayerPanels'

type GameDisplayProps = {
  game: MaterialGame
}

export const GameDisplay = ({game}: GameDisplayProps) => {
  const summerForestBoundaries = new TreesHelper(game, Season.Summer).boundaries
  const winterForestBoundaries = new TreesHelper(game, Season.Winter).boundaries
  const xMin = -70 - Math.max(summerForestBoundaries.xMax - summerForestBoundaries.xMin - 2, 0) * playerForestLocator.gridGap
  const xMax = 70 + Math.max(winterForestBoundaries.xMax - winterForestBoundaries.xMin - 2, 0) * playerForestLocator.gridGap
  return <>
    <GameTable xMin={xMin} xMax={xMax} yMin={-30} yMax={33}
      margin={{ top: 7, left: 0, right: 0, bottom: 0 }}
      css={process.env.NODE_ENV === 'development' && css`border: 1px solid white;`}>
      <GameTableNavigation />
      <PlayerPanels />
    </GameTable>
  </>
}
