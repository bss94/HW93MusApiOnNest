import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  Req,
  UseInterceptors,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AlbumDocument } from '../schemas/album.schema';
import { TrackDocument } from '../schemas/track.schema';
import { CreateTrackDTO } from './create-track.dto';

@Controller('tracks')
export class TracksController {
  constructor(
    @InjectModel('Track') private trackModel: Model<TrackDocument>,
    @InjectModel('Album') private albumModel: Model<AlbumDocument>,
  ) {}

  @Get()
  async getTracks(@Param('album') album: string) {
    return this.trackModel.find(album ? { album: album } : {});
  }

  @Post()
  async createTrack(@Body() trackData: CreateTrackDTO) {
    const album = await this.albumModel.findById(trackData.album);
    if (!album) {
      throw new NotFoundException('Album with this id not found');
    }
    return await this.trackModel.create({
      album: trackData.album,
      title: trackData.title,
      time: trackData.time,
      trackNumber: trackData.trackNumber,
    });
  }

  @Delete(':id')
  async deleteTrack(@Param('id') id: string) {
    const track = this.trackModel.findById(id);
    if (!track) {
      throw new NotFoundException('Track with this id not found');
    }
    track.deleteOne();
    return { track: track, flag: 'deleted successfully' };
  }
}
