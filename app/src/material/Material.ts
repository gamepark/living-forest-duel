import { MaterialType } from '@gamepark/living-forest-duel/material/MaterialType'
import { MaterialDescription } from '@gamepark/react-game'
import { clearingCardDescription } from './ClearingCardDescription'
import { animalCardDescription } from './AnimalCardDescription'

export const Material: Partial<Record<MaterialType, MaterialDescription>> = {
  [MaterialType.ClearingCard]: clearingCardDescription,
  [MaterialType.AnimalCard]: animalCardDescription
}
