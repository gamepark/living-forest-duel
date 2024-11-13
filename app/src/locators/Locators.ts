import { LocationType } from '@gamepark/living-forest-duel/material/LocationType'
import { MaterialType } from '@gamepark/living-forest-duel/material/MaterialType'
import { Season } from '@gamepark/living-forest-duel/Season'
import { Locator } from '@gamepark/react-game'

export const Locators: Partial<Record<LocationType, Locator<Season, MaterialType, LocationType>>> = {}
