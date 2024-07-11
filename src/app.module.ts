import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { PrismaModule } from './prisma/prisma.module'
import { CommonModule } from './common/common.module'
import { MailerModule } from './mailer/mailer.module'
import { AuthModule } from './auth/auth.module'
import { APP_FILTER, APP_GUARD } from '@nestjs/core'
import { AuthGuard } from './auth/auth.guard'
import { HttpExceptionFilter } from './common/filters/http-exception.filter'

@Module({
  imports: [PrismaModule, CommonModule, MailerModule, AuthModule],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
    { provide: APP_GUARD, useClass: AuthGuard },
  ],
})
export class AppModule {}
