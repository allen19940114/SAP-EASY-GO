import {
  Controller,
  Post,
  Get,
  Delete,
  Param,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  Body,
  Request,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { DocumentService } from './document.service';
import { UploadDocumentDto } from './dto/upload-document.dto';

@Controller('api/knowledge/documents')
@UseGuards(JwtAuthGuard)
export class DocumentController {
  constructor(private documentService: DocumentService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async upload(
    @UploadedFile() file: Express.Multer.File,
    @Body() dto: UploadDocumentDto,
    @Request() req,
  ) {
    return this.documentService.uploadDocument(req.user.userId, file, dto);
  }

  @Get()
  async list(@Request() req) {
    return this.documentService.listDocuments(req.user.userId);
  }

  @Get(':id')
  async get(@Param('id') id: string, @Request() req) {
    return this.documentService.getDocument(id, req.user.userId);
  }

  @Delete(':id')
  async delete(@Param('id') id: string, @Request() req) {
    return this.documentService.deleteDocument(id, req.user.userId);
  }
}
