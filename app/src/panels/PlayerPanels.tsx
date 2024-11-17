/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import { Season } from '@gamepark/living-forest-duel/Season'
import { StyledPlayerPanel, usePlayers } from '@gamepark/react-game'
import { createPortal } from 'react-dom'

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
                            css={[panelCss, player.id === Season.Summer ? left : right]}/>
                            // css={panelPosition(index)}/>
      )}
    </>,
    root
  )
}
// const panelPosition = (index: number) => css`
//   position: absolute;
//   right: 1em;
//   top: ${8.5 + index * 16}em;
//   width: 28em;
// `
const panelCss = css`
  position: absolute;
  transform: translateY(50%) translateY(75em);
  width: 28em;
`

const left = css`
  left: 0em
`

const right = css`
  right: 0em
`

export const playerColorCode: Record<Season, string> = {
  [Season.Summer]: '#D1B93D',
  [Season.Winter]: '#64467A'
}