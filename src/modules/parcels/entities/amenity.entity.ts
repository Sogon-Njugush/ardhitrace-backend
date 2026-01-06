import { Entity, PrimaryGeneratedColumn, Column, Index } from 'typeorm';
import type { Geometry } from 'geojson';

export enum AmenityType {
  SCHOOL = 'SCHOOL',
  HOSPITAL = 'HOSPITAL',
  WATER_POINT = 'WATER_POINT',
  POLICE_STATION = 'POLICE_STATION',
  ROAD_ACCESS = 'ROAD_ACCESS',
}

@Entity('amenities')
export class Amenity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ type: 'enum', enum: AmenityType })
  type: AmenityType;

  @Index({ spatial: true })
  @Column({
    type: 'geometry',
    spatialFeatureType: 'Point',
    srid: 4326,
  })
  location: Geometry;
}
