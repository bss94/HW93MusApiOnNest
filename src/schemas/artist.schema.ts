import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ArtistDocument = Artist & Document;

@Schema()
export class Artist {
  @Prop({ required: true, unique: true })
  name: string;
  @Prop()
  information: string;
  @Prop()
  photo: string;
}

export const ArtistSchema = SchemaFactory.createForClass(Artist);
