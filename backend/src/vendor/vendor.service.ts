import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';  // Adjust path to PrismaService
import { CreateVendorDto } from './dto/create-vendor.dto';
import { UpdateVendorDto } from './dto/update-vendor.dto';

@Injectable()
export class VendorService {
  constructor(private prisma: PrismaService) {}

  // Create a Vendor
  async create(createVendorDto: CreateVendorDto) {
    return this.prisma.vendor.create({
      data: createVendorDto,
    });
  }

  // Get all Vendors
  async findAll() {
    return this.prisma.vendor.findMany();
  }

  // Get a specific Vendor by ID
  async findOne(id: number) {
    return this.prisma.vendor.findUnique({
      where: { id },
    });
  }

  // Update Vendor details
  async update(id: number, updateVendorDto: UpdateVendorDto) {
    return this.prisma.vendor.update({
      where: { id },
      data: updateVendorDto,
    });
  }

  // Delete a Vendor
  async remove(id: number) {
    return this.prisma.vendor.delete({
      where: { id },
    });
  }
}
