import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, IsPhoneNumber, IsNotEmpty } from 'class-validator';
import { Column, CreateDateColumn, DeleteDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Feeds } from './Feeds';
import { Payments } from './Payments';
import { Reviews } from './Reviews';
import { UserGym } from './UserGym';
import { userMembership } from './common/user.membership';

@Entity('users', { schema: 'sixpack' })
export class Users {
  @ApiProperty({ example: 1, description: '일반유저 아이디' })
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @ApiProperty({ example: 'sixpack@google.com', description: '일반유저 이메일', required: true })
  @IsEmail()
  @IsNotEmpty()
  @Column('varchar', { name: 'email', unique: true, length: 30 })
  email: string;

  @ApiProperty({ example: '1234', description: '일반유저 비밀번호', required: true })
  @IsString()
  @IsNotEmpty()
  @Column('varchar', { name: 'password', length: 100 })
  password: string;

  @ApiProperty({ example: '010-1234-5678', description: '일반유저 전화번호', required: true })
  @IsPhoneNumber('KR')
  @Column('varchar', { name: 'phone', length: 30 })
  phone: string;

  @ApiProperty({ example: '홍길동', description: '일반유저 이름', required: true })
  @IsString()
  @IsNotEmpty()
  @Column('varchar', { name: 'nickname', length: 30 })
  nickname: string;

  @ApiProperty({ example: 'Basic', description: '일반유저 구독등급' })
  @Column({ type: 'enum', enum: userMembership, name: 'membership', default: null, nullable: true })
  membership: userMembership;

  @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', name: 'updated_at', nullable: true })
  updatedAt: Date | null;

  @DeleteDateColumn({ type: 'timestamp', name: 'deleted_at' })
  deletedAt: Date | null;

  @OneToMany(() => Feeds, (feeds) => feeds.user)
  feeds: Feeds[];

  @OneToMany(() => Payments, (payments) => payments.user)
  payments: Payments[];

  @OneToMany(() => UserGym, (userGym) => userGym.user)
  userGyms: UserGym[];
}
