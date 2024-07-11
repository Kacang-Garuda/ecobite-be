import { IsNotEmpty, IsOptional, IsString } from 'class-validator'

export class EditProfileDTO {
  @IsString()
  @IsNotEmpty()
  name: string

  @IsString()
  @IsNotEmpty()
  phone: string

  @IsString()
  @IsOptional()
  description?: string

  @IsString()
  @IsOptional()
  qris?: string
}
