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
import { Gym } from './Gym';
import { UserGym } from './UserGym';
import { Users } from './Users';

@Entity('reviews', { schema: 'sixpack' })
export class Reviews {
  @ApiProperty({ example: 1, description: '리뷰 아이디' })
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @ApiProperty({ example: '좋아요~', description: '리뷰 내용' })
  @Column('varchar', { name: 'review', length: 255 })
  review: string;

  @ApiProperty({ example: 5, description: '별점' })
  @Column('int', { name: 'star' })
  star: number;

  @ApiProperty({ example: '파일이름.jpg', description: '리뷰 이미지' })
  @Column('varchar', { name: 'img', nullable: true, length: 255 })
  img: string | null;

  @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', name: 'updated_at', nullable: true })
  updatedAt: Date | null;

  @DeleteDateColumn({ type: 'timestamp', name: 'deleted_at' })
  deletedAt: Date | null;

  // @ManyToOne(() => Gym, (gym) => gym.reviews, {
  //   onDelete: 'CASCADE',
  //   onUpdate: 'CASCADE',
  // })
  // @JoinColumn([{ name: 'gym_id', referencedColumnName: 'id' }])
  // gym: Gym;

  // @ManyToOne(() => Users, (users) => users.reviews, {
  //   onDelete: 'CASCADE',
  //   onUpdate: 'CASCADE',
  // })
  // @JoinColumn([{ name: 'user_id', referencedColumnName: 'id' }])
  // user: Users;
  @OneToMany(() => UserGym, (userGym) => userGym.review)
  userGyms: UserGym[];
}
