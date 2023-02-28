import { ApiProperty } from '@nestjs/swagger';
import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { paymentStatus } from './common/payment.status';
import { Users } from './Users';

@Entity('payments', { schema: 'sixpack' })
export class Payments {
  @ApiProperty({ example: 1, description: '결제 아이디' })
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @ApiProperty({ example: 1, description: '일반유저 아이디' })
  @Column('int', { primary: true, name: 'user_id' })
  userId: number;

  @ApiProperty({ example: 'imp_0123123', description: '아임포트 결제 고유 아이디' })
  @Column('varchar', { name: 'imp_uid', length: 255 })
  impUid: string;

  @ApiProperty({ example: 'merchant_0123123', description: '가맹점 고유 아이디' })
  @Column('varchar', { name: 'merchant_uid', length: 100 })
  merchantUid: string;

  @ApiProperty({ example: 'customer_0123123', description: '고객 고유 아이디' })
  @Column('varchar', { name: 'customer_uid', length: 100 })
  customerUid: string;

  @ApiProperty({ example: 0, description: '결제 상태' })
  @Column({ type: 'varchar', name: 'status', default: paymentStatus.WAITING })
  status: paymentStatus;

  @ApiProperty({ example: 1000, description: '결제 금액' })
  @Column('int', { name: 'amount' })
  amount: number;

  @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
  createdAt: Date;

  @DeleteDateColumn({ type: 'timestamp', name: 'deleted_at' })
  deletedAt: Date | null;

  @ManyToOne(() => Users, (users) => users.payments, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'user_id', referencedColumnName: 'id' }])
  user: Users;
}
