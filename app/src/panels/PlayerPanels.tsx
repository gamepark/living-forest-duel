/** @jsxImportSource @emotion/react */
import { Season } from '@gamepark/living-forest-duel/Season'
import { usePlayers } from '@gamepark/react-game'
import { createPortal } from 'react-dom'
import { Panel } from './Panel'

export const PlayerPanels = () => {
  const players = usePlayers<Season>()
  const root = document.getElementById('root')
  if (!root) {
    return null
  }

  return createPortal(<>{players.map(player => <Panel key={player.id} player={player}/>)}</>, root)
}
