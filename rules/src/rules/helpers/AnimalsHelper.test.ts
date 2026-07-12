import { MaterialGame } from '@gamepark/rules-api'
import { describe, expect, it } from 'vitest'
import { Animal } from '../../material/Animal'
import { LocationType } from '../../material/LocationType'
import { MaterialType } from '../../material/MaterialType'
import { Season } from '../../Season'
import { AnimalsHelper } from './AnimalsHelper'

type Item = { id?: any; location: { type: LocationType; player?: Season; x?: number }; quantity?: number }

const buildGame = (options: {
  sharedHelpLine?: Animal[]
  summerHelpLine?: Animal[]
  winterHelpLine?: Animal[]
  summerSupply?: number
  summerLost?: number
}): MaterialGame<Season, MaterialType, LocationType> => {
  const animalCards: Item[] = []
  let x = 0
  for (const id of options.sharedHelpLine ?? []) {
    animalCards.push({ id, location: { type: LocationType.SharedHelpLine, x: x++ } })
  }
  x = 0
  for (const id of options.summerHelpLine ?? []) {
    animalCards.push({ id, location: { type: LocationType.PlayerHelpLine, player: Season.Summer, x: x++ } })
  }
  x = 0
  for (const id of options.winterHelpLine ?? []) {
    animalCards.push({ id, location: { type: LocationType.PlayerHelpLine, player: Season.Winter, x: x++ } })
  }

  const actionTokens: Item[] = []
  if (options.summerSupply) {
    actionTokens.push({ id: Season.Summer, location: { type: LocationType.PlayerActionSupply, player: Season.Summer }, quantity: options.summerSupply })
  }
  for (let i = 0; i < (options.summerLost ?? 0); i++) {
    actionTokens.push({ id: Season.Summer, location: { type: LocationType.PlayerActionLost, player: Season.Summer, x: i } })
  }

  return {
    players: [Season.Summer, Season.Winter],
    items: {
      [MaterialType.AnimalCard]: animalCards,
      [MaterialType.ActionToken]: actionTokens
    },
    memory: {}
  }
}

const lostTokens = (options: Parameters<typeof buildGame>[0]) => {
  const game = buildGame(options)
  return new AnimalsHelper(game).getSolitaryPenaltyMoves(Season.Summer)
}

describe('AnimalsHelper.getSolitaryPenaltyMoves', () => {
  // Solitary animals used in tests: Bear, Cobra, Lynx (all AnimalType.Solitary), plus varans (id 199/299)
  const solitary = [Animal.Bear, Animal.Cobra, Animal.Lynx]

  it('loses no token below 3 solitary symbols', () => {
    expect(lostTokens({ sharedHelpLine: solitary.slice(0, 2), summerSupply: 2 })).toHaveLength(0)
  })

  it('loses 1 token at the 3rd solitary symbol', () => {
    const moves = lostTokens({ sharedHelpLine: solitary.slice(0, 3), summerSupply: 2 })
    expect(moves).toHaveLength(1)
    expect(moves[0].location.type).toBe(LocationType.PlayerActionLost)
  })

  it('loses both tokens at the 4th solitary symbol when none was lost yet (the reported bug)', () => {
    // 2 solitary animals in the shared river + 2 varans in the player zone = 4 symbols
    const moves = lostTokens({
      sharedHelpLine: [Animal.Bear, Animal.Cobra],
      summerHelpLine: [Animal.SummerVaran, Animal.SummerVaran],
      summerSupply: 2,
      summerLost: 0
    })
    expect(moves).toHaveLength(2)
  })

  it('loses only the 2nd token at the 4th symbol when 1 was already lost (incremental path)', () => {
    const moves = lostTokens({ sharedHelpLine: solitary.slice(0, 3), summerHelpLine: [Animal.SummerVaran], summerSupply: 1, summerLost: 1 })
    expect(moves).toHaveLength(1)
  })

  it('does not lose a 2nd token at exactly 3 symbols when 1 was already lost (gregarious oscillation guard)', () => {
    const moves = lostTokens({ sharedHelpLine: solitary.slice(0, 3), summerSupply: 1, summerLost: 1 })
    expect(moves).toHaveLength(0)
  })

  it('never loses more tokens than are available in the supply', () => {
    // 4 symbols would call for 2 tokens, but only 1 remains in supply (the other was already used)
    const moves = lostTokens({ sharedHelpLine: solitary, summerHelpLine: [Animal.SummerVaran], summerSupply: 1, summerLost: 0 })
    expect(moves).toHaveLength(1)
  })

  it('does not lose tokens again once both are already lost', () => {
    const moves = lostTokens({ sharedHelpLine: solitary, summerHelpLine: [Animal.SummerVaran], summerSupply: 0, summerLost: 2 })
    expect(moves).toHaveLength(0)
  })

  it('a gregarious symbol cancels a solitary symbol', () => {
    // 3 solitary + 1 gregarious (Stag) = net 2 => no penalty
    expect(lostTokens({ sharedHelpLine: [...solitary, Animal.Stag], summerSupply: 2 })).toHaveLength(0)
  })
})
