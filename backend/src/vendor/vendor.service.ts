import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateVendorDto } from './dto/create-vendor.dto';
import { UpdateVendorDto } from './dto/update-vendor.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class VendorService {
  constructor(private prisma: PrismaService) {}

  // Create Vendor with nested contacts and bank details
  async create(createVendorDto: CreateVendorDto) {
    const { contacts, bankDetails, website, products, ...vendorData } = createVendorDto;
  
    return this.prisma.vendor.create({
      data: {
        ...vendorData,
        website,
        products,
        contacts: {
          create: contacts,
        },
        bankDetails: {
          create: bankDetails,
        },
      },
      include: {
        contacts: true,
        bankDetails: true,
      },
    });
  }
  

  // Get all Vendors including nested relations
  async findAll() {
    return this.prisma.vendor.findMany({
      include: {
        contacts: true,
        bankDetails: true,
      },
    });
  }

  // Get Vendor by ID including nested relations
  async findOne(id: number) {
    return this.prisma.vendor.findUnique({
      where: { id },
      include: {
        contacts: true,
        bankDetails: true,
      },
    });
  }

  // Update Vendor and nested contacts/banks
  async update(id: number, updateVendorDto: UpdateVendorDto) {
    const { contacts, bankDetails, ...vendorData } = updateVendorDto;

    // Update base vendor
    const updatedVendor = await this.prisma.vendor.update({
      where: { id },
      data: { ...vendorData },
    });

    // Replace nested contacts if provided
    if (contacts) {
      await this.prisma.vendorContact.deleteMany({ where: { vendorId: id } });
      await this.prisma.vendorContact.createMany({
        data: contacts.map((contact) => ({
          ...contact,
          vendorId: id,
        })) as Prisma.VendorContactCreateManyInput[],
      });
      
    }

    // Replace nested bankDetails if provided
    if (bankDetails) {
      await this.prisma.bankDetail.deleteMany({ where: { vendorId: id } });
      await this.prisma.bankDetail.createMany({
        data: bankDetails.map((bank) => ({
          ...bank,
          vendorId: id,
        })) as Prisma.BankDetailCreateManyInput[],
      });
      
    }

    return this.findOne(id);
  }

  // Delete Vendor (cascades will handle nested records)
  async remove(id: number) {
    return this.prisma.vendor.delete({
      where: { id },
    });
  }
}
