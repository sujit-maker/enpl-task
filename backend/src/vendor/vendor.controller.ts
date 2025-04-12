import { Controller, Get, Post, Body, Param, Delete, Patch, Put, ParseIntPipe, UploadedFile, UseInterceptors, BadRequestException } from '@nestjs/common';
import { VendorService } from './vendor.service';
import { CreateVendorDto } from './dto/create-vendor.dto';
import { UpdateVendorDto } from './dto/update-vendor.dto';
import { FileInterceptor } from '@nestjs/platform-express'; // Import FileInterceptor
import { diskStorage } from 'multer';  // Import diskStorage from multer
import { extname } from 'path';  // Import extname from path module
import * as fs from 'fs'; // To handle file deletion
import { Multer } from 'multer';  // Import from multer package

@Controller('vendors')
export class VendorController {
  constructor(private readonly vendorService: VendorService) {}

  // Create a new vendor
  @Post()
  @UseInterceptors(
    FileInterceptor('gstCertificate', {
      storage: diskStorage({
        destination: './uploads/gst-certificates',
        filename: (req, file, cb) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
        },
      }),
      fileFilter: (req, file, cb) => {
        if (file.mimetype !== 'application/pdf') {
          return cb(new Error('Only PDF files are allowed'), false);
        }
        cb(null, true);
      },
    }),
  )
  async create(
    @Body() body: any,
    @UploadedFile() file: Express.Multer.File,
  ) {
    try {
      const {
        contacts,
        bankDetails,
        products,
        ...vendorData
      } = body;
  
      const parsedContacts = JSON.parse(contacts || '[]');
      const parsedBankDetails = JSON.parse(bankDetails || '[]');
      const parsedProducts = JSON.parse(products || '[]');
  
      if (file) {
        vendorData.gstpdf = file.filename;
      }
  
      return this.vendorService.create({
        ...vendorData,
        contacts: parsedContacts,
        bankDetails: parsedBankDetails,
        products: parsedProducts,
      });
    } catch (error) {
      console.error('Error parsing vendor form data:', error);
      throw new BadRequestException('Invalid vendor data');
    }
  }
  
  // Get all vendors
  @Get()
  async findAll() {
    return this.vendorService.findAll();
  }

  // Get vendor by ID
  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.vendorService.findOne(id);
  }

  // Update a vendor
  @Put(':id')
  async update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateVendorDto) {
    return this.vendorService.update(id, dto);
  }

  // Delete a vendor
  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    const vendor = await this.vendorService.findOne(id);
    if (vendor.gstpdf) {
      // Delete the file from the file system if it exists
      const filePath = `./uploads/gst-certificates/${vendor.gstpdf}`;
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);  // Remove the file
      }
    }
    return this.vendorService.remove(id);
  }
}
