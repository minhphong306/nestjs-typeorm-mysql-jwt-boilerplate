import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Status } from '../enum/status';
import { CategoryType } from '../enum/categoryType';
export default class TripResponse {
  public id: number;
  public userId: number;
  public name: string;
  public description: string;
  public featureImages: string[];
  public from: Date;
  public to: Date;
  public status: Status;
  public categoryType: CategoryType;
  public transportTypes: string;
  public budgetFrom: number;
  public budgetTo: number;
  public language: string;
  public host: {
    name: string;
    age: number;
  };
  memberCount: number;
  localGuideCount: number;
}
