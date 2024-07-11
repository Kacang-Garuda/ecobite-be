import { MoneyDonationProgressEnum } from '@prisma/client'
import { Type } from 'class-transformer'
import { IsDate, IsEnum, IsIn, IsOptional, IsString } from 'class-validator'

export class FilterGetMoneyDonationReceived {
  @IsOptional()
  @IsEnum(MoneyDonationProgressEnum)
  status: MoneyDonationProgressEnum

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  startDate: Date

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  endDate: Date

  @IsOptional()
  @IsString()
  @IsIn(['asc', 'desc'])
  sortBy: 'asc' | 'desc'
}
