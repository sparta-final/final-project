import { Gym } from 'src/global/entities/Gym';
import { ApiProperty } from '@nestjs/swagger';
import { Column, CreateDateColumn, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { IsNotEmpty, IsNumber } from 'class-validator';

@Entity('calculate', { schema: 'sixpack' })
export class Calculate {
  @ApiProperty({ example: 1, description: '정산 아이디' })
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @ApiProperty({ example: 1, description: '가맹점 아이디' })
  @Column('int', { name: 'gym_id' })
  gymId: number;

  @ApiProperty({ example: 1000000, description: '정산 금액' })
  @IsNumber()
  @IsNotEmpty()
  @Column('int', { name: 'paid' })
  paid: number;

  @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
  createdAt: Date;

  @ManyToOne(() => Gym, (gym) => gym.calculate, {
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn([{ name: 'gym_id', referencedColumnName: 'id' }])
  gym: Gym;
}
