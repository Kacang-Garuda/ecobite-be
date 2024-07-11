import { CATEGORY } from '@prisma/client'
import {
  IsBoolean,
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsString,
} from 'class-validator'

export class CreateFoodDonationDto {
  @IsNotEmpty()
  @IsString()
  title: string

  @IsNotEmpty()
  @IsString()
  description: string

  @IsNotEmpty()
  @IsString()
  recipientEmail: string | 'ALL'

  @IsNotEmpty()
  @IsEnum(CATEGORY)
  category: CATEGORY

  @IsNotEmpty()
  @IsBoolean()
  isInstitution: boolean

  @IsNotEmpty()
  @IsString()
  imageUrl: string

  @IsNotEmpty()
  @IsNumber()
  quantity: number

  @IsNotEmpty()
  @IsDate()
  expiredDate: Date

  @IsNotEmpty()
  @IsString()
  instruction: string

  @IsNotEmpty()
  @IsString()
  location: string
}
