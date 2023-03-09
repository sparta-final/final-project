import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UserGym } from './UserGym';

@Entity('reviews', { schema: 'sixpack' })
export class Reviews {
  @ApiProperty({ example: 1, description: '리뷰 아이디' })
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @ApiProperty({ example: '좋아요~', description: '리뷰 내용', nullable: true })
  @Column('varchar', { name: 'review', length: 255 })
  review: string;

  @ApiProperty({ example: 5, description: '별점', nullable: true })
  @Column('int', { name: 'star' })
  star: number;

  @ApiProperty({ type: 'string', format: 'binary', description: '리뷰 이미지', nullable: true })
  @Column('varchar', { name: 'reviewImg', nullable: true, length: 255 })
  reviewImg: string | null;

  @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', name: 'updated_at', nullable: true })
  updatedAt: Date | null;

  @DeleteDateColumn({ type: 'timestamp', name: 'deleted_at' })
  deletedAt: Date | null;

  @ManyToOne(() => UserGym, (userGym) => userGym.reviews, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'user_gym_id', referencedColumnName: 'id' }])
  userGym: UserGym;
}
