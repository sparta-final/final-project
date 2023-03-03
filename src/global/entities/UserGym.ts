import { ApiProperty } from '@nestjs/swagger';
import { Column, CreateDateColumn, Entity, Index, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Gym } from './Gym';
import { Reviews } from './Reviews';
import { Users } from './Users';

@Entity('user_gym', { schema: 'sixpack' })
export class UserGym {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @ApiProperty({ example: 1, description: '헬스장 아이디' })
  @Column('int', { name: 'gym_id' })
  gymId: number;

  @ApiProperty({ example: 1, description: '일반유저 아이디' })
  @Column('int', { name: 'user_id' })
  userId: number;

  @ApiProperty({ example: 1, description: '리뷰 아이디' })
  @Column('int', { name: 'review_id', nullable: true })
  reviewId: number;

  @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
  createdAt: Date;

  @OneToMany(() => Reviews, (reviews) => reviews.userGym)
  reviews: Reviews[];

  @ManyToOne(() => Gym, (gym) => gym.userGyms, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'gym_id', referencedColumnName: 'id' }])
  gym: Gym;

  @ManyToOne(() => Users, (users) => users.userGyms, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'user_id', referencedColumnName: 'id' }])
  user: Users;
}
