import { IdExist } from '../global/validators/id-exist.validator';
import { IsDateString, IsMongoId, IsNotEmpty } from 'class-validator';

export class CreateAlbumDTO {
  @IsMongoId()
  @IdExist('artist')
  artist: string;

  @IsNotEmpty()
  title: string;

  @IsDateString()
  date: string;
}
