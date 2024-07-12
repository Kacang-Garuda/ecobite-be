import { Global, Module } from '@nestjs/common'
import { EncryptionUtil } from './utils/encryption.util'
import { ResponseUtil } from './utils/response.util'
import { Public } from './decorators/public.decorator'
import { GetUser } from './decorators/getUser.decorator'

@Global()
@Module({
  providers: [ResponseUtil, EncryptionUtil],
  exports: [ResponseUtil, EncryptionUtil, Public, GetUser],
  imports: [],
})
export class CommonModule {}
