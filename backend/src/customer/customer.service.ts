import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';  // Adjust the path if needed
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';

@Injectable()
export class CustomerService {
  constructor(private prisma: PrismaService) {}

  // Create a Customer
  async create(createCustomerDto: CreateCustomerDto) {
    return this.prisma.customer.create({
      data: createCustomerDto,
    });
  }

  // Get all Customers
  async findAll() {
    return this.prisma.customer.findMany();
  }

  // Get a specific Customer by ID
  async findOne(id: number) {
    return this.prisma.customer.findUnique({
      where: { id },
      include: {
        Sites: true, // Include related sites
      },
    });
  }

  // Update Customer details
  async update(id: number, updateCustomerDto: UpdateCustomerDto) {
    return this.prisma.customer.update({
      where: { id },
      data: updateCustomerDto,
    });
  }

  // Delete a Customer
  async remove(id: number) {
    return this.prisma.customer.delete({
      where: { id },
    });
  }
}
