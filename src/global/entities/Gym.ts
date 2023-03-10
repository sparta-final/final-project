import { IsString, IsNotEmpty, IsPhoneNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Busienssusers } from './Busienssusers';
import { GymImg } from './GymImg';
import { Reviews } from './Reviews';
import { UserGym } from './UserGym';
import { isApprove } from './common/gym.isApprove';
import { GymType } from './common/enums';
import { Calculate } from './Calculate';

@Entity('gym', { schema: 'sixpack' })
export class Gym {
  @ApiProperty({ example: 1, description: '헬스장 아이디' })
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @ApiProperty({ example: 1, description: '헬스장 소유자 아이디' })
  @Column('int', { name: 'business_id' })
  businessId: number;

  @ApiProperty({ example: '스파르타 헬스장', description: '헬스장 이름' })
  @IsString()
  @IsNotEmpty()
  @Column('varchar', { name: 'name', length: 100 })
  name: string;

  @ApiProperty({ example: '010-1234-5678', description: '헬스장 전화번호' })
  @IsPhoneNumber('KR')
  @IsNotEmpty()
  @Column('varchar', { name: 'phone', length: 100 })
  phone: string;

  // @ApiProperty({ example: '03253', description: '헬스장 우편번호' })
  // @IsString()
  // @IsNotEmpty()
  // @Column('varchar', { name: 'zipCode', length: 100 })
  // zipCode: string;

  // @ApiProperty({ example: '서울시 강남구 테헤란로 427', description: '헬스장 주소' })
  // @IsString()
  // @IsNotEmpty()
  // @Column('varchar', { name: 'address', length: 100 })
  // address: string;

  // @ApiProperty({ example: '201호', description: '헬스장 상세주소' })
  // @IsString()
  // @IsNotEmpty()
  // @Column('varchar', { name: 'addressDetail', length: 100 })
  // addressDetail: string;

  @ApiProperty({ example: '37.4979', description: '헬스장 위도' })
  @IsString()
  @IsNotEmpty()
  @Column('varchar', { name: 'lat', length: 100 })
  lat: string;

  @ApiProperty({ example: '127.02761', description: '헬스장 경도' })
  @IsString()
  @IsNotEmpty()
  @Column('varchar', { name: 'lng', length: 100 })
  lng: string;

  @ApiProperty({ example: '헬스장', description: '체육관 유형' })
  @IsString()
  @IsNotEmpty()
  @Column({ type: 'enum', name: 'gymType', enum: GymType })
  gymType!: GymType;

  @ApiProperty({ example: '아주 좋은 헬스장입니다~', description: '헬스장 설명' })
  @IsString()
  @IsNotEmpty()
  @Column('varchar', { name: 'description', length: 255 })
  description: string;

  @ApiProperty({ type: 'string', format: 'binary', description: '사업자등록증 파일 이름' })
  @Column('varchar', { name: 'certification', length: 255 })
  @IsNotEmpty()
  certification: string;

  @ApiProperty({ example: 'Approve', description: '헬스장 승인 여부' })
  @Column({ type: 'enum', enum: isApprove, name: 'isApprove', default: isApprove.NotApprove })
  isApprove: isApprove;

  @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', name: 'updated_at', nullable: true })
  updatedAt: Date | null;

  @DeleteDateColumn({ type: 'timestamp', name: 'deleted_at' })
  deletedAt: Date | null;

  @ManyToOne(() => Busienssusers, (busienssusers) => busienssusers.gyms, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'business_id', referencedColumnName: 'id' }])
  business: Busienssusers;

  @OneToMany(() => GymImg, (gymImg) => gymImg.gym)
  gymImgs: GymImg[];

  @OneToMany(() => UserGym, (userGym) => userGym.gym)
  userGyms: UserGym[];

  @OneToMany(() => Calculate, (calculate) => calculate.gym)
  calculate: Calculate[];
}
