import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Feeds } from './Feeds';

@Entity('feeds_img', { schema: 'sixpack' })
export class FeedsImg {
  @ApiProperty({ example: 1, description: '피드 이미지 아이디' })
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @ApiProperty({ example: 1, description: '피드 아이디' })
  @Column('int', { name: 'feed_id' })
  feedId: number;

  @ApiProperty({ example: '파일이름.jpg', description: '피드 이미지' })
  @Column('varchar', { name: 'image', nullable: true, length: 10000 })
  image: string | null;

  @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', name: 'updated_at', nullable: true })
  updatedAt: Date | null;

  @DeleteDateColumn({ type: 'timestamp', name: 'deleted_at' })
  deletedAt: Date | null;

  @ManyToOne(() => Feeds, (feeds) => feeds.feedsImgs, {
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn([{ name: 'feed_id', referencedColumnName: 'id' }])
  feed: Feeds;
}
