import { Type } from 'class-transformer'
import { IsDate, IsNotEmpty, IsString } from 'class-validator'

export class CreateEventDto {
  @IsNotEmpty()
  @IsString()
  title: string

  @IsNotEmpty()
  @IsDate()
  @Type(() => Date)
  date: Date

  @IsNotEmpty()
  @IsString()
  city: string

  @IsNotEmpty()
  @IsString()
  location: string

  @IsNotEmpty()
  @IsString()
  description: string

  @IsNotEmpty()
  @IsString()
  jobDescription: string

  @IsNotEmpty()
  @IsString()
  benefit: string

  @IsNotEmpty()
  @IsString()
  image: string
}
