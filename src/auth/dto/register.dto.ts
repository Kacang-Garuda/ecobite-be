import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator'

export class RegisterDTO {
  @IsString()
  @IsNotEmpty()
  email: string

  @IsBoolean()
  @IsNotEmpty()
  isInstitution: boolean

  @IsString()
  @IsNotEmpty()
  password: string

  @IsString()
  @IsNotEmpty()
  name: string

  @IsString()
  @IsNotEmpty()
  phone: string

  @IsString()
  @IsNotEmpty()
  profileImage: string

  @IsString()
  @IsOptional()
  description?: string

  @IsString()
  @IsOptional()
  qris?: string
}
