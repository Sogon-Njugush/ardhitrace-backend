import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  Index,
  JoinColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import type { Geometry } from 'geojson';

export enum ParcelStatus {
  AVAILABLE = 'AVAILABLE',
  RESERVED = 'RESERVED',
  SOLD = 'SOLD',
  ARCHIVED = 'ARCHIVED', // For expired listings
  PENDING_REVIEW = 'PENDING_REVIEW',
}

export enum ParcelType {
  MOTHER_TITLE = 'MOTHER_TITLE',
  SUB_PLOT = 'SUB_PLOT',
  STANDALONE = 'STANDALONE',
}

@Entity('parcels')
export class Parcel {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  titleNumber: string; // Masked on frontend until paid

  @Column('float')
  price: number;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column('float')
  areaInAcres: number;

  // --- GIS DATA ---
  // Stores both Points (simple listings) and Polygons (verified boundaries)
  @Index({ spatial: true })
  @Column({
    type: 'geometry',
    spatialFeatureType: 'Geometry',
    srid: 4326,
  })
  location: Geometry;

  @Column({
    type: 'enum',
    enum: ParcelStatus,
    default: ParcelStatus.PENDING_REVIEW,
  })
  status: ParcelStatus;

  @Column({ type: 'enum', enum: ParcelType, default: ParcelType.STANDALONE })
  type: ParcelType;

  // --- HIERARCHY (Mother Title Logic) ---
  @ManyToOne(() => Parcel, (parcel) => parcel.subdivisions, { nullable: true })
  @JoinColumn({ name: 'motherTitleId' })
  motherTitle: Parcel;

  @OneToMany(() => Parcel, (parcel) => parcel.motherTitle)
  subdivisions: Parcel[];

  // --- OWNERSHIP ---
  @ManyToOne(() => User, (user) => user.listings)
  seller: User;

  @Column({ type: 'timestamp', nullable: true })
  expiresAt: Date; // For 30-day auto-expiry logic

  @CreateDateColumn()
  listedAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
