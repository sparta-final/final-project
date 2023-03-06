import { Module } from '@nestjs/common';
import { FeedService } from './feed.service';
import { FeedController } from './feed.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { MulterModule } from '@nestjs/platform-express';
import { multerOptionsFactory } from 'src/global/util/multer.options';
import { Feeds } from 'src/global/entities/Feeds';
import { FeedsImg } from 'src/global/entities/FeedsImg';
import { Users } from 'src/global/entities/Users';
import { Comments } from 'src/global/entities/Comments';

@Module({
  imports: [
    TypeOrmModule.forFeature([Feeds, FeedsImg, Users, Comments]),
    JwtModule.register({}),
    MulterModule.registerAsync({
      useFactory: multerOptionsFactory,
    }),
  ],
  controllers: [FeedController],
  providers: [FeedService],
})
export class FeedModule {}
