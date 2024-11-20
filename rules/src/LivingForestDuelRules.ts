import { FillGapStrategy, MaterialGame, MaterialMove, MaterialRules, PositiveSequenceStrategy, TimeLimit } from '@gamepark/rules-api'
import { LocationType } from './material/LocationType'
import { MaterialType } from './material/MaterialType'
import { Season } from './Season'
import { PlayerActionRule } from './rules/PlayerActionRule'
import { EndTurnRule } from './rules/EndTurnRule'
import { RuleId } from './rules/RuleId'
import { ExtinguishingFireRule } from './rules/ExtinguishingFireRule'
import { RecruitingAnimalsRule } from './rules/RecruitingAnimalsRule'
import { PlantingProtectiveTreeRule } from './rules/PlantingProtectiveTreeRule'
import { AdvancingOnibiRule } from './rules/AdvancingOnibiRule'
import { EndGameRule } from './rules/EndGameRule'
import { RefillRecruitmentLineRule } from './rules/RefillRecruitmentLineRule'
import { CustomNegativeFillGapStrategy } from './material/location/strategy/CustomNegativeFillGapStrategy'


/**
 * This class implements the rules of the board game.
 * It must follow Game Park "Rules" API so that the Game Park server can enforce the rules.
 */
export class LivingForestDuelRules extends MaterialRules<Season, MaterialType, LocationType>
  implements TimeLimit<MaterialGame<Season, MaterialType, LocationType>, MaterialMove<Season, MaterialType, LocationType>, Season> {
  rules = {
    [RuleId.PlayerAction]: PlayerActionRule,
    [RuleId.ExtinguishingFire]: ExtinguishingFireRule,
    [RuleId.RecruitingAnimals]: RecruitingAnimalsRule,
    [RuleId.RefillRecruitmentLine]: RefillRecruitmentLineRule,
    [RuleId.PlantingProtectiveTree]: PlantingProtectiveTreeRule,
    [RuleId.AdvancingOnibi]: AdvancingOnibiRule,
    [RuleId.CheckEndTurn]: EndTurnRule,
    [RuleId.EndGame]: EndGameRule
  }

  locationsStrategies = {
    [MaterialType.ActionToken]: {
      [LocationType.PlayerActionSupply]: new FillGapStrategy()
    },
    [MaterialType.AnimalCard]: {
      [LocationType.SeasonAnimalDeck]: new PositiveSequenceStrategy(),
      [LocationType.SharedDeck]: new PositiveSequenceStrategy(),
      [LocationType.SharedHelpLine]: new PositiveSequenceStrategy(),
      [LocationType.PersonalHelpLine]: new PositiveSequenceStrategy(),
      [LocationType.RecruitmentLine]: new CustomNegativeFillGapStrategy(),
    },
    [MaterialType.TreeCard]: {
      [LocationType.TreeDeckSpot]: new PositiveSequenceStrategy()
    }
  }

  giveTime(): number {
    return 60
  }
}
