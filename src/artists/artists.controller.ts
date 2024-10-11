import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { Artist, ArtistDocument } from '../schemas/artist.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateArtistDTO } from './create-artist.dto';
import { AlbumDocument } from '../schemas/album.schema';
import { TrackDocument } from '../schemas/track.schema';

@Controller('artists')
export class ArtistsController {
  constructor(
    @InjectModel(Artist.name) private artistModel: Model<ArtistDocument>,
    @InjectModel('Album') private albumModel: Model<AlbumDocument>,
    @InjectModel('Track') private trackModel: Model<TrackDocument>,
  ) {}

  @Get()
  async getArtists() {
    return this.artistModel.find();
  }

  @Get(':id')
  async getArtist(@Param('id') id: string) {
    const artist = await this.artistModel.findById(id);
    if (!artist) {
      throw new NotFoundException('Artist with this id not found');
    }
    return artist;
  }

  @Post()
  @UseInterceptors(FileInterceptor('photo', { dest: './public/images' }))
  async createArtist(
    @Body() artistData: CreateArtistDTO,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return await this.artistModel.create({
      name: artistData.name,
      information: artistData.information,
      photo: file ? 'images/' + file.filename : null,
    });
  }

  @Delete(':id')
  async deleteArtist(@Param('id') id: string) {
    const artist = await this.artistModel.findById(id);
    if (!artist) {
      throw new NotFoundException('Artist with this id not found');
    }
    const albums = await this.albumModel.find({ artist: artist.id });
    if (albums.length > 0) {
      for (const album of albums) {
        const tracks = await this.trackModel.find({ album: album.id });
        if (tracks.length > 0) {
          for (const track of tracks) {
            await track.deleteOne();
          }
        }
        await album.deleteOne();
      }
    }
    await artist.deleteOne();
    return { artist: artist, flag: 'Artist and child deleted successfully' };
  }
}
