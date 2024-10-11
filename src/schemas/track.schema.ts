import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { Album } from './album.schema';

export type TrackDocument = Track & Document;

@Schema()
export class Track {
  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: 'Album' })
  album: Album;
  @Prop({ required: true })
  title: string;
  @Prop({ required: true })
  time: string;
  @Prop({ required: true })
  trackNumber: number;
}

export const TrackSchema = SchemaFactory.createForClass(Track);
