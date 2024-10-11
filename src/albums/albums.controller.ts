import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { AlbumDocument } from '../schemas/album.schema';
import { Model } from 'mongoose';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateAlbumDTO } from './create-album.dto';
import { ArtistDocument } from '../schemas/artist.schema';

@Controller('albums')
export class AlbumsController {
  constructor(
    @InjectModel('Album') private albumModel: Model<AlbumDocument>,
    @InjectModel('Artist') private artistModel: Model<ArtistDocument>,
  ) {}

  @Get()
  async getAlbums(@Query('artist') artist: string) {
    return this.albumModel.find(artist ? { artist: artist } : {});
  }

  @Get(':id')
  async getAlbum(@Param('id') id: string) {
    const album = await this.albumModel.findById(id);
    if (!album) {
      throw new NotFoundException('Album with this id not found');
    }
    return album;
  }

  @Post()
  @UseInterceptors(FileInterceptor('image', { dest: './public/images' }))
  async createAlbum(
    @Body() albumData: CreateAlbumDTO,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const artist = await this.artistModel.findById(albumData.artist);
    if (!artist) {
      throw new NotFoundException('Artist with this id not found');
    }
    return await this.albumModel.create({
      artist: albumData.artist,
      title: albumData.title,
      date: albumData.date,
      image: file ? 'images/' + file.filename : null,
    });
  }

  @Delete(':id')
  async deleteArtist(@Param('id') id: string) {
    const album = await this.albumModel.findById(id);
    if (!album) {
      throw new NotFoundException('Album with this id not found');
    }

    await album.deleteOne();
    return { album: album, flag: 'deleted successfully' };
  }
}
