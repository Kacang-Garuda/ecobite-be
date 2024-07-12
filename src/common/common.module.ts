import { Global, Module } from '@nestjs/common'
import { EncryptionUtil } from './utils/encryption.util'
import { ResponseUtil } from './utils/response.util'

@Global()
@Module({
  providers: [ResponseUtil, EncryptionUtil],
  exports: [ResponseUtil, EncryptionUtil],
  imports: [],
})
export class CommonModule {}
