/** @jsxImportSource @emotion/react */
import { LivingForestDuelOptionsSpec } from '@gamepark/living-forest-duel/LivingForestDuelOptions'
import { LivingForestDuelRules } from '@gamepark/living-forest-duel/LivingForestDuelRules'
import { LivingForestDuelSetup } from '@gamepark/living-forest-duel/LivingForestDuelSetup'
import { GameProvider, setupTranslation } from '@gamepark/react-game'
import { StrictMode } from 'react'
import ReactDOM from 'react-dom'
import { gameAnimations } from './animations/GameAnimations'
import App from './App'
import { Locators } from './locators/Locators'
import { Material } from './material/Material'
import translations from './translations.json'

setupTranslation(translations, { debug: false })

ReactDOM.render(
  <StrictMode>
    <GameProvider
      game="living-forest-duel"
      Rules={LivingForestDuelRules}
      optionsSpec={LivingForestDuelOptionsSpec}
      GameSetup={LivingForestDuelSetup}
      material={Material}
      locators={Locators}
      animations={gameAnimations}>
      <App/>
    </GameProvider>
  </StrictMode>,
  document.getElementById('root')
)
