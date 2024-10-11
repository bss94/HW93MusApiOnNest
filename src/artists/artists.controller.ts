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

@Controller('artists')
export class ArtistsController {
  constructor(
    @InjectModel(Artist.name) private artistModel: Model<ArtistDocument>,
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

    await artist.deleteOne();
    return artist;
  }
}
