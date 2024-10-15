import { IsNotEmpty } from 'class-validator';

export class CreateArtistDTO {
  @IsNotEmpty()
  name: string;

  information: string;
}
