import { FillGapStrategy, MaterialGame, MaterialMove, MaterialRules, TimeLimit } from '@gamepark/rules-api'
import { LocationType } from './material/LocationType'
import { MaterialType } from './material/MaterialType'
import { Season } from './Season'
import { TheFirstStepRule } from './rules/TheFirstStepRule'
import { RuleId } from './rules/RuleId'


/**
 * This class implements the rules of the board game.
 * It must follow Game Park "Rules" API so that the Game Park server can enforce the rules.
 */
export class LivingForestDuelRules extends MaterialRules<Season, MaterialType, LocationType>
  implements TimeLimit<MaterialGame<Season, MaterialType, LocationType>, MaterialMove<Season, MaterialType, LocationType>, Season> {
  rules = {
    [RuleId.TheFirstStep]: TheFirstStepRule
  }

  locationsStrategies = {
    [MaterialType.ActionToken]: {
      [LocationType.PlayerActionSupply]: new FillGapStrategy()
    }
  }

  giveTime(): number {
    return 60
  }
}