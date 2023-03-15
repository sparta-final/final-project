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
import { Comments } from './Comments';
import { Users } from './Users';
import { FeedsImg } from './FeedsImg';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

@Index('user_id', ['userId'], {})
@Entity('feeds', { schema: 'sixpack' })
export class Feeds {
  @ApiProperty({ example: 1, description: '피드 아이디' })
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @ApiProperty({ example: 1, description: '일반유저 아이디' })
  @Column('int', { name: 'user_id' })
  userId: number;

  @ApiProperty({ example: '피드 내용', description: '피드 내용' })
  @IsNotEmpty()
  @IsString()
  @Column('varchar', { name: 'content', length: 1000 })
  content: string;

  @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', name: 'updated_at', nullable: true })
  updatedAt: Date | null;

  @DeleteDateColumn({ type: 'timestamp', name: 'deleted_at' })
  deletedAt: Date | null;

  @OneToMany(() => Comments, (comments) => comments.feed)
  comments: Comments[];

  @ManyToOne(() => Users, (users) => users.feeds, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'user_id', referencedColumnName: 'id' }])
  user: Users;

  @OneToMany(() => FeedsImg, (feedsImg) => feedsImg.feed, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  feedsImgs: FeedsImg[];
}
