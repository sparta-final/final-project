import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Column, CreateDateColumn, DeleteDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity('adminusers', { schema: 'sixpack' })
export class Adminusers {
  @ApiProperty({ example: 1, description: '어드민 아이디' })
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @ApiProperty({ example: 'admin@gmail.com', description: '어드민 이메일' })
  @IsEmail()
  @IsNotEmpty()
  @Column('varchar', { name: 'email', length: 100 })
  email: string;

  @ApiProperty({ example: '1234', description: '어드민 비밀번호' })
  @IsNotEmpty()
  @IsString()
  @Column('varchar', { name: 'password', length: 255 })
  password: string;

  @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', name: 'updated_at', nullable: true })
  updatedAt: Date | null;

  @DeleteDateColumn({ type: 'timestamp', name: 'deleted_at' })
  deletedAt: Date | null;
}
