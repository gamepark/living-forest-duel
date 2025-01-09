/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import { Season } from '@gamepark/living-forest-duel/Season'
import { StyledPlayerPanel, usePlayers } from '@gamepark/react-game'
import { createPortal } from 'react-dom'
import SummerBackground from '../images/backgrounds/SummerBackground.jpg'
import WinterBackground from '../images/backgrounds/WinterBackground.jpg'

export const PlayerPanels = () => {
  const players = usePlayers<Season>({ sortFromMe: true })
  const root = document.getElementById('root')
  if (!root) {
    return null
  }

  return createPortal(
    <>
      {players.map((player) =>
        <StyledPlayerPanel key={player.id} player={player} color={playerColorCode[player.id]}
                           backgroundImage={player.id === Season.Summer ? SummerBackground : WinterBackground}
                           css={[panelCss, player.id === Season.Summer ? left : right]}/>
      )}
    </>,
    root
  )
}

const panelCss = css`
  position: absolute;
  transform: translateY(50%) translateY(75em);
  width: 28em;
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