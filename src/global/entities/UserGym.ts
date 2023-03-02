import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Gym } from './Gym';
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

  @ApiProperty({ example: 10, description: '일반유저가 해당 헬스장에 방문한 횟수' })
  @Column('int', { name: 'count' })
  count: number;

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
