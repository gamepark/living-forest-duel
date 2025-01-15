import { getEnumValues } from '@gamepark/rules-api'
import { Element, Season } from '../Season'

export enum Animal {
  // Stag
  Stag = 0,
  // Common animals
  Anteater = 1,
  Bat,
  Bear,
  Chameleon,
  Cobra,
  Cockatoo,
  Crocodile,
  Elephant,
  Gorilla,
  Hippopotamus,
  Lynx,
  Meerkat,
  Panda,
  Peacock,
  Racoon,
  Spider,
  Tapir,
  Weasel,
  // Summer animals
  Axolotl = 101,
  Bee,
  Chimpanzee,
  Coati,
  Flamingo,
  Fox,
  Frog,
  Goat,
  Hummingbird,
  Owl,
  Platypus,
  Rhinoceros,
  Tanuki,
  Tiger,
  Toucan,
  // Summer varan
  SummerVaran = 199,
  // Winter animals
  Bison = 201,
  Crane,
  Dolphin,
  Eagle,
  Goldfish,
  Hare,
  HornedOwl,
  Macaque,
  Mantis,
  Panther,
  Ram,
  Raven,
  Salamander,
  Squirrel,
  Wolf,
  // Winter varan
  WinterVaran = 299
}

export enum AnimalType {
  Neutral = 1,
  Solitary,
  Gregarious
}

export type CardPattern = {
  type: AnimalType,
  elements: Partial<Record<Element, number>>,
  cost: number
}

export const animalProperties: Record<Animal, CardPattern> = {
  [Animal.Stag]: {
    type: AnimalType.Gregarious,
    elements: {},
    cost: 7
  },
  [Animal.SummerVaran]: {
    type: AnimalType.Solitary,
    elements: {},
    cost: 0
  },
  [Animal.WinterVaran]: {
    type: AnimalType.Solitary,
    elements: {},
    cost: 0
  },
  [Animal.Anteater]: {
    type: AnimalType.Neutral,
    elements: {
      [Element.Sun]: 2,
      [Element.Wind]: 1
    },
    cost: 0
  },
  [Animal.Bat]: {
    type: AnimalType.Neutral,
    elements: {
      [Element.Sun]: 1,
      [Element.Wind]: 1
    },
    cost: 0
  },
  [Animal.Bear]: {
    type: AnimalType.Solitary,
    elements: {
      [Element.Water]: 2,
      [Element.Plant]: 2
    },
    cost: 0
  },
  [Animal.Chameleon]: {
    type: AnimalType.Neutral,
    elements: {
      [Element.Water]: 1,
      [Element.Wind]: 1
    },
    cost: 0
  },
  [Animal.Cobra]: {
    type: AnimalType.Solitary,
    elements: {
      [Element.Sun]: 1,
      [Element.Plant]: 2,
      [Element.Wind]: 1
    },
    cost: 0
  },
  [Animal.Cockatoo]: {
    type: AnimalType.Neutral,
    elements: {
      [Element.Sun]: 1,
      [Element.Plant]: 2
    },
    cost: 0
  },
  [Animal.Crocodile]: {
    type: AnimalType.Neutral,
    elements: {
      [Element.Water]: 3,
      [Element.Plant]: -1
    },
    cost: 0
  },
  [Animal.Elephant]: {
    type: AnimalType.Neutral,
    elements: {
      [Element.Sun]: -1,
      [Element.Wind]: 2
    },
    cost: 0
  },
  [Animal.Gorilla]: {
    type: AnimalType.Neutral,
    elements: {
      [Element.Sun]: 2,
      [Element.Water]: 1,
      [Element.Plant]: 1,
      [Element.Wind]: -1
    },
    cost: 0
  },
  [Animal.Hippopotamus]: {
    type: AnimalType.Solitary,
    elements: {
      [Element.Sun]: 1,
      [Element.Water]: 2,
      [Element.Plant]: 1
    },
    cost: 0
  },
  [Animal.Lynx]: {
    type: AnimalType.Solitary,
    elements: {
      [Element.Water]: 1,
      [Element.Wind]: 2
    },
    cost: 0
  },
  [Animal.Meerkat]: {
    type: AnimalType.Neutral,
    elements: {
      [Element.Sun]: 2,
      [Element.Plant]: 1
    },
    cost: 0
  },
  [Animal.Panda]: {
    type: AnimalType.Neutral,
    elements: {
      [Element.Sun]: 2,
      [Element.Water]: -1,
      [Element.Plant]: 2
    },
    cost: 0
  },
  [Animal.Peacock]: {
    type: AnimalType.Neutral,
    elements: {
      [Element.Sun]: 2,
      [Element.Water]: 1
    },
    cost: 0
  },
  [Animal.Racoon]: {
    type: AnimalType.Neutral,
    elements: {
      [Element.Sun]: 1,
      [Element.Water]: 1,
      [Element.Plant]: 1
    },
    cost: 0
  },
  [Animal.Spider]: {
    type: AnimalType.Solitary,
    elements: {
      [Element.Sun]: 3,
      [Element.Water]: 1,
      [Element.Plant]: 1
    },
    cost: 0
  },
  [Animal.Tapir]: {
    type: AnimalType.Solitary,
    elements: {
      [Element.Sun]: 2,
      [Element.Water]: 2,
      [Element.Plant]: 1
    },
    cost: 0
  },
  [Animal.Weasel]: {
    type: AnimalType.Neutral,
    elements: {
      [Element.Sun]: 1,
      [Element.Water]: 2
    },
    cost: 0
  },
  [Animal.Axolotl]: {
    type: AnimalType.Neutral,
    elements: {
      [Element.Sun]: 1,
      [Element.Water]: 2,
      [Element.Wind]: 2
    },
    cost: 9
  },
  [Animal.Bee]: {
    type: AnimalType.Neutral,
    elements: {
      [Element.Wind]: 2
    },
    cost: 4
  },
  [Animal.Chimpanzee]: {
    type: AnimalType.Gregarious,
    elements: {
      [Element.Sun]: 3,
      [Element.Water]: -1
    },
    cost: 8
  },
  [Animal.Coati]: {
    type: AnimalType.Neutral,
    elements: {
      [Element.Sun]: 3
    },
    cost: 1
  },
  [Animal.Flamingo]: {
    type: AnimalType.Neutral,
    elements: {
      [Element.Sun]: 3,
      [Element.Water]: 2
    },
    cost: 5
  },
  [Animal.Fox]: {
    type: AnimalType.Neutral,
    elements: {
      [Element.Sun]: 2,
      [Element.Plant]: 1,
      [Element.Wind]: 1
    },
    cost: 5
  },
  [Animal.Frog]: {
    type: AnimalType.Neutral,
    elements: {
      [Element.Water]: 2,
      [Element.Plant]: 2
    },
    cost: 6
  },
  [Animal.Goat]: {
    type: AnimalType.Neutral,
    elements: {
      [Element.Plant]: 2
    },
    cost: 2
  },
  [Animal.Hummingbird]: {
    type: AnimalType.Neutral,
    elements: {
      [Element.Water]: 2
    },
    cost: 2
  },
  [Animal.Owl]: {
    type: AnimalType.Solitary,
    elements: {
      [Element.Sun]: 2,
      [Element.Plant]: 4,
      [Element.Wind]: 1
    },
    cost: 6
  },
  [Animal.Platypus]: {
    type: AnimalType.Neutral,
    elements: {
      [Element.Sun]: 1,
      [Element.Water]: 4
    },
    cost: 7
  },
  [Animal.Rhinoceros]: {
    type: AnimalType.Neutral,
    elements: {
      [Element.Water]: 1,
      [Element.Plant]: 4
    },
    cost: 8
  },
  [Animal.Tanuki]: {
    type: AnimalType.Neutral,
    elements: {
      [Element.Sun]: 5
    },
    cost: 3
  },
  [Animal.Tiger]: {
    type: AnimalType.Neutral,
    elements: {
      [Element.Sun]: 1,
      [Element.Water]: 2,
      [Element.Plant]: 2
    },
    cost: 7
  },
  [Animal.Toucan]: {
    type: AnimalType.Gregarious,
    elements: {
      [Element.Sun]: 1,
      [Element.Wind]: -1
    },
    cost: 5
  },
  [Animal.Bison]: {
    type: AnimalType.Neutral,
    elements: {
      [Element.Water]: 1,
      [Element.Plant]: 4
    },
    cost: 8
  },
  [Animal.Crane]: {
    type: AnimalType.Neutral,
    elements: {
      [Element.Sun]: 3,
      [Element.Water]: 2
    },
    cost: 5
  },
  [Animal.Dolphin]: {
    type: AnimalType.Neutral,
    elements: {
      [Element.Sun]: 1,
      [Element.Water]: 4
    },
    cost: 7
  },
  [Animal.Eagle]: {
    type: AnimalType.Gregarious,
    elements: {
      [Element.Sun]: 1,
      [Element.Wind]: -1
    },
    cost: 5
  },
  [Animal.Goldfish]: {
    type: AnimalType.Neutral,
    elements: {
      [Element.Sun]: 1,
      [Element.Water]: 2,
      [Element.Wind]: 2
    },
    cost: 9
  },
  [Animal.Hare]: {
    type: AnimalType.Neutral,
    elements: {
      [Element.Sun]: 2,
      [Element.Plant]: 1,
      [Element.Wind]: 1
    },
    cost: 5
  },
  [Animal.HornedOwl]: {
    type: AnimalType.Solitary,
    elements: {
      [Element.Sun]: 2,
      [Element.Plant]: 4,
      [Element.Wind]: 1
    },
    cost: 6
  },
  [Animal.Macaque]: {
    type: AnimalType.Gregarious,
    elements: {
      [Element.Sun]: 3,
      [Element.Water]: -1
    },
    cost: 8
  },
  [Animal.Mantis]: {
    type: AnimalType.Neutral,
    elements: {
      [Element.Wind]: 2
    },
    cost: 4
  },
  [Animal.Panther]: {
    type: AnimalType.Neutral,
    elements: {
      [Element.Sun]: 1,
      [Element.Water]: 2,
      [Element.Plant]: 2
    },
    cost: 7
  },
  [Animal.Ram]: {
    type: AnimalType.Neutral,
    elements: {
      [Element.Plant]: 2
    },
    cost: 2
  },
  [Animal.Raven]: {
    type: AnimalType.Neutral,
    elements: {
      [Element.Water]: 2
    },
    cost: 2
  },
  [Animal.Salamander]: {
    type: AnimalType.Neutral,
    elements: {
      [Element.Water]: 2,
      [Element.Plant]: 2
    },
    cost: 6
  },
  [Animal.Squirrel]: {
    type: AnimalType.Neutral,
    elements: {
      [Element.Sun]: 3
    },
    cost: 1
  },
  [Animal.Wolf]: {
    type: AnimalType.Neutral,
    elements: {
      [Element.Sun]: 5
    },
    cost: 3
  }
}

export const getAnimalSeason = (animal: Animal): Season | undefined => Math.floor(animal / 100) || undefined
export const summerAnimals = getEnumValues(Animal).filter(animal => getAnimalSeason(animal) === Season.Summer && animal !== Animal.SummerVaran)
export const winterAnimals = getEnumValues(Animal).filter(animal => getAnimalSeason(animal) === Season.Winter && animal !== Animal.WinterVaran)
export const commonAnimals = getEnumValues(Animal).filter(animal => getAnimalSeason(animal) === undefined && animal !== Animal.Stag)
export const isVaran = (animal: Animal) => animal === Animal.SummerVaran || animal === Animal.WinterVaran
