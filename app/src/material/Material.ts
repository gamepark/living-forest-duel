import { MaterialType } from '@gamepark/living-forest-duel/material/MaterialType'
import { MaterialDescription } from '@gamepark/react-game'
import { clearingCardDescription } from './ClearingCardDescription'
import { animalCardDescription } from './AnimalCardDescription'
import { onibiStandeeDescription } from './OnibiStandeeDescription'
import { fireTokenDescription } from './FireTokenDescription'
import { treeCardDescription } from './TreeCardDescription'

export const Material: Partial<Record<MaterialType, MaterialDescription>> = {
  [MaterialType.ClearingCard]: clearingCardDescription,
  [MaterialType.AnimalCard]: animalCardDescription,
  [MaterialType.OnibiStandee]: onibiStandeeDescription,
  [MaterialType.FireToken]: fireTokenDescription,
  [MaterialType.TreeCard]: treeCardDescription
}
