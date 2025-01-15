import {
  CompetitiveRank,
  HiddenMaterialRules,
  hideItemId,
  MaterialGame, MaterialItem,
  MaterialMove,
  PositiveSequenceStrategy,
  StakingStrategy,
  TimeLimit
} from '@gamepark/rules-api'
import { CustomNegativeFillGapStrategy } from './material/location/strategy/CustomNegativeFillGapStrategy'
import { LocationType } from './material/LocationType'
import { MaterialType } from './material/MaterialType'
import { AdvancingOnibiRule } from './rules/AdvancingOnibiRule'
import { EndPlayerTurnRule } from './rules/EndPlayerTurnRule'
import { EndTurnRule } from './rules/EndTurnRule'
import { ExtinguishingFireRule } from './rules/ExtinguishingFireRule'
import { Memory } from './rules/Memory'
import { PlantingProtectiveTreeRule } from './rules/PlantingProtectiveTreeRule'
import { PlayerActionRule } from './rules/PlayerActionRule'
import { PlayerUseActionTokenRule } from './rules/PlayerUseActionTokenRule'
import { RecruitingAnimalsRule } from './rules/RecruitingAnimalsRule'
import { RefillRecruitmentLineRule } from './rules/RefillRecruitmentLineRule'
import { RevealTreesRule } from './rules/RevealTreesRule'
import { RuleId } from './rules/RuleId'
import { UseSankiOnVaranRule } from './rules/UseSankiOnVaranRule'
import { UseSankiPlayActionRule } from './rules/UseSankiPlayActionRule'
import { Season } from './Season'

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
    [RuleId.RevealTrees]: RevealTreesRule,
    [RuleId.AdvancingOnibi]: AdvancingOnibiRule,
    [RuleId.UseSankiOnVaran]: UseSankiOnVaranRule,
    [RuleId.UseSankiPlayAction]: UseSankiPlayActionRule,
    [RuleId.EndPlayerTurn]: EndPlayerTurnRule,
    [RuleId.EndTurn]: EndTurnRule
  }

  locationsStrategies = {
    [MaterialType.ActionToken]: {
      [LocationType.PlayerActionLost]: new PositiveSequenceStrategy()
    },
    [MaterialType.AnimalCard]: {
      [LocationType.SeasonAnimalDeck]: new PositiveSequenceStrategy(),
      [LocationType.VaranDeck]: new PositiveSequenceStrategy(),
      [LocationType.SharedDeck]: new PositiveSequenceStrategy(),
      [LocationType.SharedDiscardPile]: new PositiveSequenceStrategy(),
      [LocationType.SharedHelpLine]: new PositiveSequenceStrategy(),
      [LocationType.PlayerHelpLine]: new PositiveSequenceStrategy(),
      [LocationType.RecruitmentLine]: new CustomNegativeFillGapStrategy()
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
      [LocationType.SeasonAnimalDeck]: hideItemId
    },
    [MaterialType.TreeCard]: {
      [LocationType.TreeDeckSpot]: (item: MaterialItem) => item.location.rotation ? ['id.front'] : []
    }
  }

  giveTime(): number {
    return 60
  }

  rankPlayers(playerA: Season, _playerB: Season) {
    return playerA === this.remind(Memory.Winner) ? -1 : 1
  }
}
