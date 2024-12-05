import { CompetitiveRank, HiddenMaterialRules, hideItemId, MaterialGame, MaterialMove, PositiveSequenceStrategy, StakingStrategy, TimeLimit } from '@gamepark/rules-api'
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
import { PlayerUseActionTokenRule } from './rules/PlayerUseActionTokenRule'

/**
 * This class implements the rules of the board game.
 * It must follow Game Park "Rules" API so that the Game Park server can enforce the rules.
 */
export class LivingForestDuelRules extends HiddenMaterialRules<Season, MaterialType, LocationType>
  implements TimeLimit<MaterialGame<Season, MaterialType, LocationType>, MaterialMove<Season, MaterialType, LocationType>, Season>,
  CompetitiveRank<MaterialGame<Season, MaterialType, LocationType>, MaterialMove<Season, MaterialType, LocationType>, Season> {

  rules = {
    [RuleId.PlayerAction]: PlayerActionRule,
    [RuleId.PlayerUseActionToken]: PlayerUseActionTokenRule,
    [RuleId.ExtinguishingFire]: ExtinguishingFireRule,
    [RuleId.RecruitingAnimals]: RecruitingAnimalsRule,
    [RuleId.RefillRecruitmentLine]: RefillRecruitmentLineRule,
    [RuleId.PlantingProtectiveTree]: PlantingProtectiveTreeRule,
    [RuleId.AdvancingOnibi]: AdvancingOnibiRule,
    [RuleId.TreeBonusAction]: TreeBonusActionRule,
    [RuleId.OnibiBonusAction]: OnibiBonusActionRule,
    [RuleId.EndTurn]: EndTurnRule,
    [RuleId.UseSankiCard]: UseSankiCardRule,
    [RuleId.EndGame]: EndGameRule
  }

  locationsStrategies = {
    [MaterialType.ActionToken]: {
      [LocationType.PlayerActionLost]: new PositiveSequenceStrategy()
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
      [LocationType.TreeDeckSpot]: new PositiveSequenceStrategy(),
      [LocationType.PlayerForest]: new StakingStrategy()
    },
    [MaterialType.SpiritCard]: {
      [LocationType.PlayerSpiritLine]: new PositiveSequenceStrategy()
    }
  }

  hidingStrategies = {
    [MaterialType.AnimalCard]: {
      [LocationType.SharedDeck]: hideItemId,
      [LocationType.SharedDiscardPile]: hideItemId,
      [LocationType.SeasonAnimalDeck]: hideItemId
    }
  }

  giveTime(): number {
    return 60
  }

  rankPlayers(playerA: Season, _playerB: Season) {
    return playerA === this.getActivePlayer() ? 1 : -1
  }
}
