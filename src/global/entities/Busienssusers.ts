import { IsEmail, IsNotEmpty, IsString, IsPhoneNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Column, CreateDateColumn, DeleteDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Gym } from './Gym';

@Entity('busienssusers', { schema: 'sixpack' })
export class Busienssusers {
  @ApiProperty({ example: 1, description: '사업자 아이디' })
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @ApiProperty({ example: 'sixpack@gmail.com', description: '사업자 이메일' })
  @IsEmail()
  @IsNotEmpty()
  @Column('varchar', { name: 'email', length: 100, unique: true })
  email: string;

  @ApiProperty({ example: '1234', description: '사업자 비밀번호' })
  @IsNotEmpty()
  @IsString()
  @Column('varchar', { name: 'password', length: 255 })
  password: string;

  @ApiProperty({ example: '010-1234-5678', description: '사업자 전화번호' })
  @IsNotEmpty()
  @IsPhoneNumber('KR')
  @Column('varchar', { name: 'phone', length: 100 })
  phone: string;

  @ApiProperty({ example: '홍길동', description: '사업자 이름' })
  @IsNotEmpty()
  @IsString()
  @Column('varchar', { name: 'name', length: 30 })
  name: string;

  @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', name: 'updated_at', nullable: true })
  updatedAt: Date | null;

  @DeleteDateColumn({ type: 'timestamp', name: 'deleted_at' })
  deletedAt: Date | null;

  @OneToMany(() => Gym, (gym) => gym.business)
  gyms: Gym[];
}
