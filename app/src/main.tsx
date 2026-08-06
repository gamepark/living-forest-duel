import { LivingForestDuelOptionsSpecV2 } from '@gamepark/living-forest-duel/LivingForestDuelOptions'
import { LivingForestDuelRules } from '@gamepark/living-forest-duel/LivingForestDuelRules'
import { LivingForestDuelSetup } from '@gamepark/living-forest-duel/LivingForestDuelSetup'
import { GameProvider } from '@gamepark/react-game'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { gameAnimations } from './animations/GameAnimations'
import { App } from './App'
import { Locators } from './locators/Locators'
import { Material } from './material/Material'
import { Tutorial } from './tutorial/Tutorial'
import { TutorialAI } from './tutorial/TutorialAI'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <GameProvider
      game="living-forest-duel"
      Rules={LivingForestDuelRules}
      optionsSpec={LivingForestDuelOptionsSpecV2}
      GameSetup={LivingForestDuelSetup}
      material={Material}
      locators={Locators}
      animations={gameAnimations}
      tutorial={new Tutorial()}
      ai={TutorialAI}
    >
      <App />
    </GameProvider>
  </StrictMode>
)
