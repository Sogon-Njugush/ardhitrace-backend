import {
  Injectable,
  BadRequestException,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';

import { Repository } from 'typeorm';
import { Parcel, ParcelStatus, ParcelType } from './entities/parcel.entity';
import { CreateParcelDto } from './dto/create-parcel.dto';
import { SearchParcelDto } from './dto/search-parcel.dto';
import { User } from '../users/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Geometry } from 'geojson';

@Injectable()
export class ParcelsService {
  constructor(
    @InjectRepository(Parcel)
    private parcelsRepo: Repository<Parcel>,
  ) {}

  //  CREATE LAND (Standard Listing)
  async create(createParcelDto: CreateParcelDto, user: User) {
    if (createParcelDto.type === ParcelType.MOTHER_TITLE && !user.isVerified) {
      throw new ForbiddenException(
        'Only verified sellers can list Mother Titles (Polygons).',
      );
    }

    const parcel = this.parcelsRepo.create({
      ...createParcelDto,
      // FIX: Cast the DTO location to the Geometry type expected by TypeORM
      location: createParcelDto.location as unknown as Geometry,
      seller: user,
      status: ParcelStatus.PENDING_REVIEW,
    });

    return this.parcelsRepo.save(parcel);
  }

  //  SEARCH NEARBY (The "Find Land Here" feature)
  async findNearby(searchDto: SearchParcelDto) {
    const { lat, lng, radius = 5000, minPrice, maxPrice } = searchDto;

    const query = this.parcelsRepo
      .createQueryBuilder('parcel')
      .leftJoinAndSelect('parcel.seller', 'seller')
      .where('parcel.status = :status', { status: ParcelStatus.AVAILABLE });

    query.andWhere(
      `ST_DWithin(
        parcel.location::geography, 
        ST_SetSRID(ST_MakePoint(:lng, :lat), 4326)::geography, 
        :radius
      )`,
      { lng, lat, radius },
    );

    if (minPrice) query.andWhere('parcel.price >= :minPrice', { minPrice });
    if (maxPrice) query.andWhere('parcel.price <= :maxPrice', { maxPrice });

    query.orderBy(
      `ST_Distance(
        parcel.location::geography, 
        ST_SetSRID(ST_MakePoint(:lng, :lat), 4326)::geography
      )`,
      'ASC',
    );

    return query.getMany();
  }

  // SUBDIVISION LOGIC (The Fraud Prevention Feature)
  async createSubdivision(
    motherTitleId: string,
    createDto: CreateParcelDto,
    user: User,
  ) {
    const mother = await this.parcelsRepo.findOne({
      where: { id: motherTitleId },
      relations: ['seller'],
    });

    if (!mother) throw new NotFoundException('Mother Title not found');
    if (mother.seller.id !== user.id)
      throw new ForbiddenException('You do not own this Mother Title');
    if (mother.type !== ParcelType.MOTHER_TITLE)
      throw new BadRequestException('This parcel is not a Mother Title');

    const validationResult = await this.parcelsRepo.query(
      `SELECT ST_Contains(
         ST_GeomFromGeoJSON($1), 
         ST_GeomFromGeoJSON($2)
       ) as is_inside`,
      [JSON.stringify(mother.location), JSON.stringify(createDto.location)],
    );

    if (!validationResult[0].is_inside) {
      throw new BadRequestException(
        'Geometry Error: The Subplot boundaries fall OUTSIDE the Mother Title.',
      );
    }

    const subPlot = this.parcelsRepo.create({
      ...createDto,
      // FIX: Apply the same cast here
      location: createDto.location as unknown as Geometry,
      seller: user,
      motherTitle: mother,
      type: ParcelType.SUB_PLOT,
      status: ParcelStatus.AVAILABLE,
    });

    return this.parcelsRepo.save(subPlot);
  }

  async findOne(id: string) {
    return this.parcelsRepo.findOne({
      where: { id },
      relations: ['seller', 'subdivisions'],
    });
  }
}
