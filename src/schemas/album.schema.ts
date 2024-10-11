import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Validator, ValidatorFunction } from 'mongoose';
import mongoose from 'mongoose';
import { Artist } from './artist.schema';

export type AlbumDocument = Album & Document;

@Schema()
export class Album {
  @Prop({
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Artist',
  })
  artist: Artist;
  @Prop({ required: true })
  title: string;
  @Prop({ required: true })
  date: Date;
  @Prop()
  image: string;
}

export const AlbumSchema = SchemaFactory.createForClass(Album);
