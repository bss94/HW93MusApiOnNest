import { IdExist } from '../global/validators/id-exist.validator';
import {
  IsMilitaryTime,
  IsMongoId,
  IsNotEmpty,
  IsNumber,
} from 'class-validator';

export class CreateTrackDto {
  @IsNotEmpty()
  title: string;

  @IsMongoId()
  @IdExist('album')
  album: string;

  @IsNotEmpty()
  @IsMilitaryTime()
  time: string;

  @IsNotEmpty()
  @IsNumber()
  trackNumber: number;
}
