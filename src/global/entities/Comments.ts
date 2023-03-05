import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Feeds } from './Feeds';

@Entity('comments', { schema: 'sixpack' })
export class Comments {
  @ApiProperty({ example: 1, description: '댓글 아이디' })
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @ApiProperty({ example: 1, description: '피드 아이디' })
  @Column('int', { name: 'feed_id' })
  feedId: number;

  @ApiProperty({ example: 1, description: '일반유저 아이디' })
  @Column('int', { name: 'user_id' })
  userId: number;

  @ApiProperty({ example: '댓글 내용', description: '댓글 내용' })
  @IsString()
  @IsNotEmpty()
  @Column('varchar', { name: 'comment', length: 100 })
  comment: string;

  @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', name: 'updated_at', nullable: true })
  updatedAt: Date | null;

  @DeleteDateColumn({ type: 'timestamp', name: 'deleted_at' })
  deletedAt: Date | null;

  @ManyToOne(() => Feeds, (feeds) => feeds.comments, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'feed_id', referencedColumnName: 'id' }])
  feed: Feeds;

  @ManyToOne(() => Feeds, (feeds) => feeds.comments2, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'user_id', referencedColumnName: 'userId' }])
  user: Feeds;
}
