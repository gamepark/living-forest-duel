import { getEnumValues } from "@gamepark/rules-api";
import { Season } from "../Season";

export enum AnimalType {
  Common = 0,
  Summer = Season.Summer,
  Winter = Season.Winter,
}

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

export const getAnimalSeason = (animal: Animal) => Math.floor(animal / 100)
export const summerAnimals = getEnumValues(Animal).filter(animal => getAnimalSeason(animal) === Season.Summer && animal === Animal.SummerVaran)
export const winterAnimals = getEnumValues(Animal).filter(animal => getAnimalSeason(animal) === Season.Winter && animal !== Animal.WinterVaran)