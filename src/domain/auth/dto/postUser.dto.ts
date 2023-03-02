import { ApiProperty, PickType } from '@nestjs/swagger';
import { Users } from 'src/global/entities/Users';

export class PostUserDto extends PickType(Users, ['email', 'nickname', 'phone', 'password']) {
  @ApiProperty({ description: '비밀번호 확인', example: '1234' })
  public passwordCheck: string;
}
