/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import { LivingForestDuelRules } from '@gamepark/living-forest-duel/LivingForestDuelRules'
import { MaterialType } from '@gamepark/living-forest-duel/material/MaterialType'
import { DeckLocator, DropAreaDescription, LocationHelpProps, MaterialComponent, pointerCursorCss, usePlay, useRules } from '@gamepark/react-game'
import { MaterialMoveBuilder } from '@gamepark/rules-api'
import { useTranslation } from 'react-i18next'
import { animalCardDescription } from '../material/AnimalCardDescription'
import { sharedDeckLocator } from './SharedDeckLocator'

const displayMaterialHelp = MaterialMoveBuilder.displayMaterialHelp

class SharedDiscardPileLocator extends DeckLocator {
  coordinates = { x: sharedDeckLocator.coordinates.x - animalCardDescription.width - 2, y: sharedDeckLocator.coordinates.y }
  locationDescription = new SharedDiscardPileDescription(animalCardDescription)
}

class SharedDiscardPileDescription extends DropAreaDescription {
  help = SharedDiscardPileHelp
}

export const SharedDiscardPileHelp = ({ location }: LocationHelpProps) => {
  const { t } = useTranslation()
  const cards = useRules<LivingForestDuelRules>()?.material(MaterialType.AnimalCard).location(location.type).locationId(location.id)
    .sort(item => -item.location.x!)
  const play = usePlay()
  return <>
    <h2>{t('discard', { place: location.id })}</h2>
    <p css={maxWidth}>
      {t('discard.count', { number: cards?.length })}
    </p>
    <ol css={grid}>
      {cards?.entries.map(([index, card]) =>
        <li key={index}>
          <MaterialComponent
            type={MaterialType.AnimalCard}
            itemId={card.id}
            css={pointerCursorCss}
            onClick={() => play(displayMaterialHelp(MaterialType.AnimalCard, card, index), { local: true })}
          />
        </li>
      )}
    </ol>
  </>
}

const maxWidth = css`
  max-width: 38em;
`

const grid = css`
  display: grid;
  grid-template-columns: auto auto auto;
  list-style-type: none;
  gap: 1em;
  padding: 0 0.5em 0.5em 0;
  margin: 0;
  font-size: 1.5em;
`

export const sharedDiscardPileLocator = new SharedDiscardPileLocator()
