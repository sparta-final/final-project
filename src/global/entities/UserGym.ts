import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Gym } from './Gym';
import { Reviews } from './Reviews';
import { Users } from './Users';

@Entity('user_gym', { schema: 'sixpack' })
export class UserGym {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @ApiProperty({ example: 1, description: '헬스장 아이디' })
  @Column('int', { primary: true, name: 'gym_id' })
  gymId: number;

  @ApiProperty({ example: 1, description: '일반유저 아이디' })
  @Column('int', { primary: true, name: 'user_id' })
  userId: number;

  @ApiProperty({ example: 1, description: '리뷰 아이디' })
  @Column('int', { primary: true, name: 'review_id' })
  reviewId: number;

  @ManyToOne(() => Gym, (gym) => gym.userGyms, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'gym_id', referencedColumnName: 'id' }])
  gym: Gym;

  @ManyToOne(() => Reviews, (reviews) => reviews.userGyms, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'review_id', referencedColumnName: 'id' }])
  review: Reviews;

  @ManyToOne(() => Users, (users) => users.userGyms, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'user_id', referencedColumnName: 'id' }])
  user: Users;
}
