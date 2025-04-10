import { Controller, Get, Post, Body, Param, Delete, Patch, Put } from '@nestjs/common';
import { VendorService } from './vendor.service';
import { CreateVendorDto } from './dto/create-vendor.dto';
import { UpdateVendorDto } from './dto/update-vendor.dto';

@Controller('vendors')
export class VendorController {
  constructor(private readonly vendorService: VendorService) {}

  // Create a new vendor
  @Post()
  async create(@Body() createVendorDto: CreateVendorDto) {
    return this.vendorService.create(createVendorDto);
  }

  // Get all vendors
  @Get()
  async findAll() {
    return this.vendorService.findAll();
  }

  // Get a single vendor by ID
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.vendorService.findOne(Number(id));
  }

  // Update vendor details
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateVendorDto: UpdateVendorDto,
  ) {
    return this.vendorService.update(Number(id), updateVendorDto);
  }

  // Delete vendor
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.vendorService.remove(Number(id));
  }
}
