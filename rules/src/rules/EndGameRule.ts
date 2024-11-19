import { MaterialMove, PlayerTurnRule } from "@gamepark/rules-api"

export class EndGameRule extends PlayerTurnRule {

  onRuleStart() {
    const moves: MaterialMove[] = []

    moves.push(this.endGame())

    return moves
  }
}