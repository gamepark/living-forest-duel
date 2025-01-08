/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import { LivingForestDuelRules } from '@gamepark/living-forest-duel/LivingForestDuelRules'
import { Animal, animalProperties, AnimalType, getAnimalSeason, isVaran } from '@gamepark/living-forest-duel/material/Animal'
import { LocationType } from '@gamepark/living-forest-duel/material/LocationType'
import { MaterialType } from '@gamepark/living-forest-duel/material/MaterialType'
import { SpiritType } from '@gamepark/living-forest-duel/material/SpiritType'
import { Season } from '@gamepark/living-forest-duel/Season'
import { linkButtonCss, MaterialHelpProps, Picture, PlayMoveButton, useLegalMove, usePlayerId, usePlayerName, useRules } from '@gamepark/react-game'
import { isMoveItemType, MaterialMoveBuilder } from '@gamepark/rules-api'
import { Trans, useTranslation } from 'react-i18next'
import Gregarious from '../../images/icons/Gregarious.png'
import Plant from '../../images/icons/Plant.png'
import Solitary from '../../images/icons/Solitary.png'
import Sun from '../../images/icons/Sun.png'
import Water from '../../images/icons/Water.png'
import Wind from '../../images/icons/Wind.png'
import displayMaterialHelp = MaterialMoveBuilder.displayMaterialHelp

export const AnimalCardHelp = (props: MaterialHelpProps) => {
  const { t } = useTranslation()
  const { item } = props
  const player = usePlayerId()
  if (isVaran(item.id)) return <VaranHelp {...props}/>
  const properties = item.id !== undefined ? animalProperties[item.id as Animal] : undefined
  return <>
    <h2>{t('animal.card')}</h2>
    {item.location?.type === LocationType.SharedDeck && <SharedDeck {...props}/>}
    {item.location?.type === LocationType.SeasonAnimalDeck && <SeasonAnimalDeck {...props}/>}
    <p><Trans defaults="animal.purpose" components={{
      sun: <Picture css={iconCss} src={Sun}/>,
      water: <Picture css={iconCss} src={Water}/>,
      plant: <Picture css={iconCss} src={Plant}/>,
      wind: <Picture css={iconCss} src={Wind}/>
    }}/></p>
    {item.id !== undefined && <p>{t('animal.season', { season: getAnimalSeason(item.id) })} <Trans defaults="animal.personal" components={{
      onibi: <PlayMoveButton css={linkButtonCss} move={displayMaterialHelp(MaterialType.SpiritCard, { id: SpiritType.Onibi })} local/>
    }}/></p>}
    {item.location?.type === LocationType.RecruitmentLine && <RecruitLine {...props}/>}
    {properties?.type === AnimalType.Solitary &&
      <p><Trans defaults="animal.solitary" components={{
        bold: <strong/>,
        solitary: <Picture css={iconCss} src={Solitary}/>,
        action: <PlayMoveButton css={linkButtonCss} move={displayMaterialHelp(MaterialType.ActionToken, { id: player ?? Season.Summer })} local/>
      }}/></p>
    }
    {properties?.type === AnimalType.Gregarious &&
      <p><Trans defaults="animal.gregarious" components={{
        bold: <strong/>,
        solitary: <Picture css={iconCss} src={Solitary}/>,
        gregarious: <Picture css={iconCss} src={Gregarious}/>
      }}/></p>
    }
    {item.location?.type === LocationType.SharedHelpLine &&
      <p><Trans defaults="animal.shared" components={{
        bold: <strong/>
      }}/></p>
    }
    {item.location?.type === LocationType.PlayerHelpLine && <PlayerHelpLine {...props}/>}
  </>
}

export const SharedDeck = ({ itemIndex, closeDialog }: MaterialHelpProps) => {
  const rules = useRules<LivingForestDuelRules>()!
  const player = usePlayerId()
  const draw = useLegalMove(move => isMoveItemType(MaterialType.AnimalCard)(move) && move.itemIndex === itemIndex)
  const cards = rules.material(MaterialType.AnimalCard).location(LocationType.SharedDeck).length
  return <p><Trans defaults="animal.deck" values={{ cards: cards }} components={{
    bold: <strong/>,
    draw: draw ? <PlayMoveButton move={draw} onPlay={closeDialog}/> : <strong/>,
    action: <PlayMoveButton css={linkButtonCss} move={displayMaterialHelp(MaterialType.ActionToken, { id: player ?? Season.Summer })} local/>
  }}/></p>
}

export const SeasonAnimalDeck = ({ item }: MaterialHelpProps) => {
  const rules = useRules<LivingForestDuelRules>()!
  const player = usePlayerId()
  const cards = rules.material(MaterialType.AnimalCard).location(LocationType.SharedDeck).length
  const playerName = usePlayerName(item.location?.player)
  return <>
    {item.location?.player === player ?
      <p><Trans defaults="animal.deck.you" values={{ cards: cards }} components={{
        bold: <strong/>
      }}/></p>
      : <p><Trans defaults="animal.deck.player" values={{ cards: cards, player: playerName }} components={{
        bold: <strong/>
      }}/></p>
    }
    <p><Trans defaults="animal.win" components={{
      bold: <strong/>
    }}/></p>
  </>
}

export const RecruitLine = ({ item, itemIndex, closeDialog }: MaterialHelpProps) => {
  const { t } = useTranslation()
  const animal = item.id as Animal
  const player = usePlayerId()
  const recruit = useLegalMove(move => isMoveItemType(MaterialType.AnimalCard)(move) && move.itemIndex === itemIndex)
  return <p>
    <Trans defaults="animal.recruit" values={{ cost: animalProperties[animal].cost }} components={{
      recruit: recruit ? <PlayMoveButton move={recruit} onPlay={closeDialog}/> : <strong/>,
      sun: <Picture css={iconCss} src={Sun}/>
    }}/> {getAnimalSeason(animal) === player ? t('animal.recruit.personal') : t('animal.recruit.discard')}
  </p>
}

export const PlayerHelpLine = ({ item }: MaterialHelpProps) => {
  const player = usePlayerId()
  const playerName = usePlayerName(item.location?.player)
  if (item.location?.player === player) {
    return <p><Trans defaults="animal.you" components={{
      bold: <strong/>
    }}/></p>
  } else {
    return <p><Trans defaults="animal.player" values={{ player: playerName }} components={{
      bold: <strong/>
    }}/></p>
  }
}

const VaranHelp = ({ item }: MaterialHelpProps) => {
  const { t } = useTranslation()
  const rules = useRules<LivingForestDuelRules>()!
  const deck = rules.material(MaterialType.AnimalCard).location(LocationType.VaranDeck).player(getAnimalSeason(item.id)).length
  return <>
    <h2>{t('varan')}</h2>
    <p>{t('varan.count', { deck, count: 7 - deck })}</p>
    <p>{t('varan.personal')}</p>
    <p><strong>{t('varan.receive')}</strong></p>
    <p><Trans defaults="end-turn.varan" components={{
      water: <Picture css={iconCss} src={Water}/>
    }}/></p>
  </>
}

const iconCss = css`
  vertical-align: sub;
  height: 1.2em;
`
