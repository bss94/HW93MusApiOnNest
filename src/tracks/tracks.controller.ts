import { Controller, Get, NotFoundException, Param } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AlbumDocument } from '../schemas/album.schema';
import { TrackDocument } from '../schemas/track.schema';

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
}
