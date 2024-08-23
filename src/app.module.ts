import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TweetsModule } from './tweets/tweets.module';
import { LikesModule } from './likes/likes.module';
import { AuthModule } from './auth/auth.module';
import { dataSourceOptions } from './config/data-source';

@Module({
  imports: [TypeOrmModule.forRoot(dataSourceOptions), UsersModule, TweetsModule, LikesModule, AuthModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
