import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AlbumDocument } from '../schemas/album.schema';
import { TrackDocument } from '../schemas/track.schema';
import { CreateTrackDto } from './create-track.dto';
import { TokenAuthGuard } from '../auth/token-auth.guard';
import { TokenAuthAdminGuard } from '../auth/token-auth-admin.guard';

@Controller('tracks')
export class TracksController {
  constructor(
    @InjectModel('Track') private trackModel: Model<TrackDocument>,
    @InjectModel('Album') private albumModel: Model<AlbumDocument>,
  ) {}

  @Get()
  async getTracks(@Query('album') album: string) {
    return this.trackModel.find(album ? { album: album } : {});
  }

  @UseGuards(TokenAuthGuard)
  @Post()
  async createTrack(@Body() trackData: CreateTrackDto) {
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

  @UseGuards(TokenAuthAdminGuard)
  @Delete(':id')
  async deleteTrack(@Param('id') id: string) {
    const track = await this.trackModel.findById(id);
    if (!track) {
      throw new NotFoundException('Track with this id not found');
    }
    await track.deleteOne();
    return { track: track, flag: 'deleted successfully' };
  }
}
