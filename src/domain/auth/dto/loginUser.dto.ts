import { Users } from 'src/global/entities/Users';
import { PickType } from '@nestjs/swagger';

export class LoginUserDto extends PickType(Users, ['email', 'password']) {}
