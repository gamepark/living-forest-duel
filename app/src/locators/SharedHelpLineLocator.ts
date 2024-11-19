import { ListLocator } from "@gamepark/react-game";
import { animalCardDescription } from "../material/AnimalCardDescription";
import { recruitmentLineLocator } from "./RecruitmentLineLocator";

class SharedHelpLineLocator extends ListLocator {
  gap = { x: animalCardDescription.width + 1 }
  maxCount = 10
  coordinates = { x: -animalCardDescription.width * 2 - 2, y: recruitmentLineLocator.coordinates.y + 11 }
}

export const sharedHelpLineLocator = new SharedHelpLineLocator()