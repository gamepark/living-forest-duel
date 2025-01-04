import { faArrowRight } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Animal } from '@gamepark/living-forest-duel/material/Animal'
import { LocationType } from '@gamepark/living-forest-duel/material/LocationType'
import { MaterialType } from '@gamepark/living-forest-duel/material/MaterialType'
import { CardDescription, ItemContext, ItemMenuButton, MaterialContext } from '@gamepark/react-game'
import { isMoveItemType, MaterialItem, MaterialMove } from '@gamepark/rules-api'
import { Trans } from 'react-i18next'
import AnimalCardBack from '../images/cards/animals/AnimalCardBack.jpg'
import Anteater from '../images/cards/animals/Anteater.jpg'
import Axolotl from '../images/cards/animals/Axolotl.jpg'
import Bat from '../images/cards/animals/Bat.jpg'
import Bear from '../images/cards/animals/Bear.jpg'
import Bee from '../images/cards/animals/Bee.jpg'
import Bison from '../images/cards/animals/Bison.jpg'
import Chameleon from '../images/cards/animals/Chameleon.jpg'
import Chimpanzee from '../images/cards/animals/Chimpanzee.jpg'
import Coati from '../images/cards/animals/Coati.jpg'
import Cobra from '../images/cards/animals/Cobra.jpg'
import Cockatoo from '../images/cards/animals/Cockatoo.jpg'
import Crane from '../images/cards/animals/Crane.jpg'
import Crocodile from '../images/cards/animals/Crocodile.jpg'
import Dolphin from '../images/cards/animals/Dolphin.jpg'
import Eagle from '../images/cards/animals/Eagle.jpg'
import Elephant from '../images/cards/animals/Elephant.jpg'
import Flamingo from '../images/cards/animals/Flamingo.jpg'
import Fox from '../images/cards/animals/Fox.jpg'
import Frog from '../images/cards/animals/Frog.jpg'
import Goat from '../images/cards/animals/Goat.jpg'
import Goldfish from '../images/cards/animals/Goldfish.jpg'
import Gorilla from '../images/cards/animals/Gorilla.jpg'
import Hare from '../images/cards/animals/Hare.jpg'
import Hippopotamus from '../images/cards/animals/Hippopotamus.jpg'
import HornedOwl from '../images/cards/animals/HornedOwl.jpg'
import Hummingbird from '../images/cards/animals/Hummingbird.jpg'
import Lynx from '../images/cards/animals/Lynx.jpg'
import Macaque from '../images/cards/animals/Macaque.jpg'
import Mantis from '../images/cards/animals/Mantis.jpg'
import Meerkat from '../images/cards/animals/Meerkat.jpg'
import Owl from '../images/cards/animals/Owl.jpg'
import Panda from '../images/cards/animals/Panda.jpg'
import Panther from '../images/cards/animals/Panther.jpg'
import Peacock from '../images/cards/animals/Peacock.jpg'
import Platypus from '../images/cards/animals/Platypus.jpg'
import Racoon from '../images/cards/animals/Racoon.jpg'
import Ram from '../images/cards/animals/Ram.jpg'
import Raven from '../images/cards/animals/Raven.jpg'
import Rhinoceros from '../images/cards/animals/Rhinoceros.jpg'
import Salamander from '../images/cards/animals/Salamander.jpg'
import Spider from '../images/cards/animals/Spider.jpg'
import Squirrel from '../images/cards/animals/Squirrel.jpg'
import Stag from '../images/cards/animals/Stag.jpg'
import Tanuki from '../images/cards/animals/Tanuki.jpg'
import Tapir from '../images/cards/animals/Tapir.jpg'
import Tiger from '../images/cards/animals/Tiger.jpg'
import Toucan from '../images/cards/animals/Toucan.jpg'
import SummerVaran from '../images/cards/animals/VaranSummer.jpg'
import WinterVaran from '../images/cards/animals/VaranWinter.jpg'
import Weasel from '../images/cards/animals/Weasel.jpg'
import Wolf from '../images/cards/animals/Wolf.jpg'

class AnimalCardDescription extends CardDescription {
  width = 6.3
  height = 8.8
  borderRadius = 0.5

  backImage = AnimalCardBack
  images = {
    [Animal.Anteater]: Anteater,
    [Animal.Axolotl]: Axolotl,
    [Animal.Bat]: Bat,
    [Animal.Bear]: Bear,
    [Animal.Bee]: Bee,
    [Animal.Bison]: Bison,
    [Animal.Chameleon]: Chameleon,
    [Animal.Chimpanzee]: Chimpanzee,
    [Animal.Coati]: Coati,
    [Animal.Cobra]: Cobra,
    [Animal.Cockatoo]: Cockatoo,
    [Animal.Crane]: Crane,
    [Animal.Crocodile]: Crocodile,
    [Animal.Dolphin]: Dolphin,
    [Animal.Eagle]: Eagle,
    [Animal.Elephant]: Elephant,
    [Animal.Flamingo]: Flamingo,
    [Animal.Fox]: Fox,
    [Animal.Frog]: Frog,
    [Animal.Goat]: Goat,
    [Animal.Goldfish]: Goldfish,
    [Animal.Gorilla]: Gorilla,
    [Animal.Hare]: Hare,
    [Animal.Hippopotamus]: Hippopotamus,
    [Animal.HornedOwl]: HornedOwl,
    [Animal.Hummingbird]: Hummingbird,
    [Animal.Lynx]: Lynx,
    [Animal.Macaque]: Macaque,
    [Animal.Mantis]: Mantis,
    [Animal.Meerkat]: Meerkat,
    [Animal.Owl]: Owl,
    [Animal.Panda]: Panda,
    [Animal.Panther]: Panther,
    [Animal.Peacock]: Peacock,
    [Animal.Platypus]: Platypus,
    [Animal.Racoon]: Racoon,
    [Animal.Ram]: Ram,
    [Animal.Raven]: Raven,
    [Animal.Rhinoceros]: Rhinoceros,
    [Animal.Salamander]: Salamander,
    [Animal.Spider]: Spider,
    [Animal.Squirrel]: Squirrel,
    [Animal.Stag]: Stag,
    [Animal.Tanuki]: Tanuki,
    [Animal.Tapir]: Tapir,
    [Animal.Tiger]: Tiger,
    [Animal.Toucan]: Toucan,
    [Animal.Weasel]: Weasel,
    [Animal.Wolf]: Wolf,
    [Animal.SummerVaran]: SummerVaran,
    [Animal.WinterVaran]: WinterVaran
  }

  isFlipped(item: Partial<MaterialItem>, context: MaterialContext) {
    if (item.location?.type === LocationType.SharedDeck || item.location?.type === LocationType.SeasonAnimalDeck) return true
    return super.isFlipped(item, context)
  }

  isFlippedOnTable(item: Partial<MaterialItem>, context: MaterialContext) {
    return item.location?.type === LocationType.SeasonAnimalDeck
      || item.location?.type === LocationType.SharedDeck
      || item.location?.type === LocationType.SharedDiscardPile
      || super.isFlippedOnTable(item, context)
  }

  getItemMenu(_item: MaterialItem, context: ItemContext, legalMoves: MaterialMove[]) {
    const draw = legalMoves.find(move =>
      isMoveItemType(MaterialType.AnimalCard)(move) && move.itemIndex === context.index && move.location.type === LocationType.SharedHelpLine
    )
    if (draw) {
      return <>
        <ItemMenuButton move={draw} x={-1.8}
                        label={<Trans defaults="button.draw"/>}>
          <FontAwesomeIcon icon={faArrowRight}/>
        </ItemMenuButton>
      </>
    }
    return null
  }

  menuAlwaysVisible = true
}

export const animalCardDescription = new AnimalCardDescription()