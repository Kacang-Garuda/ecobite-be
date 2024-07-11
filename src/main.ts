import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { ValidationPipe } from '@nestjs/common'
import * as bodyParser from 'body-parser'

async function bootstrap() {
  const whitelistUrls: any[] = (
    process.env.APP_WHITELIST || 'http://localhost:3000'
  ).split(',')

  const corsOptions = {
    credentials: true,
    origin: whitelistUrls,
    methods: '*',
  }

  const app = await NestFactory.create(AppModule)
  app.setGlobalPrefix('api')
  app.use(bodyParser.json({ limit: '50mb' }))
  app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }))
  app.enableCors(corsOptions)
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    })
  )
  await app.listen(process.env.PORT || process.env.APP_PORT || 3001)
}
bootstrap()
