import { ListLocator } from "@gamepark/react-game";
import { animalCardDescription } from "../material/AnimalCardDescription";
import { clearingLineLocator } from "./ClearingLineLocator";

class RecruitmentLineLocator extends ListLocator {
  gap = { x: animalCardDescription.width + 1 }
  coordinates = { y: clearingLineLocator.coordinates.y + 10 }
}

export const recruitmentLineLocator = new RecruitmentLineLocator()