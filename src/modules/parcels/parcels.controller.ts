import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ParcelsService } from './parcels.service';
import { CreateParcelDto } from './dto/create-parcel.dto';
import { SearchParcelDto } from './dto/search-parcel.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { User } from '../users/entities/user.entity';
import { CurrentUser } from 'src/ common/decorators/current-user.decorator';

@Controller('parcels')
export class ParcelsController {
  constructor(private readonly parcelsService: ParcelsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createParcelDto: CreateParcelDto, @CurrentUser() user: User) {
    return this.parcelsService.create(createParcelDto, user);
  }

  @Get('search')
  findAll(@Query() searchDto: SearchParcelDto) {
    // This is public (no guard), but frontend limits data shown based on Payment Session
    return this.parcelsService.findNearby(searchDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.parcelsService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/subdivide')
  createSubdivision(
    @Param('id') motherTitleId: string,
    @Body() createParcelDto: CreateParcelDto,
    @CurrentUser() user: User,
  ) {
    return this.parcelsService.createSubdivision(
      motherTitleId,
      createParcelDto,
      user,
    );
  }
}
