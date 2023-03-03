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
import { Gym } from './Gym';

@Entity('gym_img', { schema: 'sixpack' })
export class GymImg {
  @ApiProperty({ example: 1, description: '헬스장 이미지 아이디' })
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @ApiProperty({ example: 1, description: '헬스장 아이디' })
  @Column('int', {  name: 'gym_id' })
  gymId: number;

  @ApiProperty({ example: '파일이름.jpg', description: '헬스장 이미지' })
  @Column('varchar', { name: 'img', length: 255 })
  img: string;

  @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', name: 'updated_at', nullable: true })
  updatedAt: Date | null;

  @DeleteDateColumn({ type: 'timestamp', name: 'deleted_at' })
  deletedAt: Date | null;

  @ManyToOne(() => Gym, (gym) => gym.gymImgs, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'gym_id', referencedColumnName: 'id' }])
  gym: Gym;
}
