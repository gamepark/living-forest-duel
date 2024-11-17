import { ListLocator } from "@gamepark/react-game";
import { animalCardDescription } from "../material/AnimalCardDescription";
import { recruitmentLineLocator } from "./RecruitmentLineLocator";

class SharedHelpLineLocator extends ListLocator {
  gap = { x: animalCardDescription.width + 1 }
  coordinates = { y: recruitmentLineLocator.coordinates.y + 10 }
}

export const sharedHelpLineLocator = new SharedHelpLineLocator()