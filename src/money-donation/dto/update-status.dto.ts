import { MoneyDonationProgressEnum } from '@prisma/client'
import {
  ArrayMinSize,
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsString,
} from 'class-validator'

export class UpdateStatusMoneyDonationDto {
  @IsNotEmpty()
  @IsEnum(MoneyDonationProgressEnum)
  status: MoneyDonationProgressEnum

  @IsNotEmpty()
  @IsArray()
  @ArrayMinSize(1)
  @IsString({ each: true })
  moneyDonationIds: string[]
}
