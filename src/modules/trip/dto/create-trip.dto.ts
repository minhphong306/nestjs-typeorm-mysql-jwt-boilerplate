import { CategoryType } from '../enum/categoryType';

export class CreateTripDto {
  userId: number;
  categoryType: CategoryType;
  name: string;
  description: string;
  featureImages: string[];
  fromTime: string;
  toTime: string;
  location: string;
  budgetFrom: number;
  budgetTo: number;
  language: string;
}
