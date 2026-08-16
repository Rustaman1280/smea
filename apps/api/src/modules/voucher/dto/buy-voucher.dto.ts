import { IsNotEmpty, IsString, IsEnum, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { PaymentMethod } from '@prisma/client';

export class BuyVoucherDto {
  @ApiProperty({ description: 'ID Voucher yang dibeli' })
  @IsNotEmpty()
  @IsString()
  voucherId: string;

  @ApiProperty({ enum: PaymentMethod, default: PaymentMethod.SALDO_INTERNAL })
  @IsNotEmpty()
  @IsEnum(PaymentMethod)
  paymentMethod: PaymentMethod;
}
