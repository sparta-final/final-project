import { Users } from 'src/global/entities/Users';
import { PickType } from '@nestjs/swagger';

export class KakaoLoginUserDto extends PickType(Users, ['email', 'nickname']) {}
