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
import { TreeBonusActionRule } from './rules/TreeBonusActionRule'
import { OnibiBonusActionRule } from './rules/OnibiBonusActionRule'
import { UseSankiCardRule } from './rules/UseSankiCardRule'

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
    [RuleId.TreeBonusAction]: TreeBonusActionRule,
    [RuleId.OnibiBonusAction]: OnibiBonusActionRule,
    [RuleId.CheckEndTurn]: EndTurnRule,
    [RuleId.UseSankiCard]: UseSankiCardRule,
    [RuleId.EndGame]: EndGameRule
  }

  locationsStrategies = {
    [MaterialType.ActionToken]: {
      [LocationType.PlayerActionSupply]: new FillGapStrategy()
    },
    [MaterialType.AnimalCard]: {
      [LocationType.SeasonAnimalDeck]: new PositiveSequenceStrategy(),
      [LocationType.SharedDeck]: new PositiveSequenceStrategy(),
      [LocationType.SharedDiscardPile]: new PositiveSequenceStrategy(),
      [LocationType.SharedHelpLine]: new PositiveSequenceStrategy(),
      [LocationType.PlayerHelpLine]: new PositiveSequenceStrategy(),
      [LocationType.RecruitmentLine]: new CustomNegativeFillGapStrategy(),
    },
    [MaterialType.TreeCard]: {
      [LocationType.TreeDeckSpot]: new PositiveSequenceStrategy()
    },
    [MaterialType.SpiritCard]: {
      // [LocationType.SankiDeck]: new PositiveSequenceStrategy(),
      [LocationType.PlayerSpiritLine]: new PositiveSequenceStrategy()
    }
  }

  giveTime(): number {
    return 60
  }
}
