import {
  Body,
  Controller,
  Get,
  Inject,
  Post,
  Query,
  Res,
  UploadedFile,
  UseInterceptors,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express/multer";
import { BlobStorage } from "src/infra/storage/blob/blob.storage";
import { IBlobStorage } from "src/infra/storage/blob/iblob.storage";
import { FileRequest } from "./dtos/file-request.dto";
import { Response } from "express";

@Controller("file")
export class FileController {
  constructor(
    @Inject(BlobStorage) private readonly _blobStorage: IBlobStorage
  ) {}

  @Post()
  @UseInterceptors(FileInterceptor("file"))
  async upload(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: FileRequest,
    @Res() response: Response
  ) {
    const fileExtesion = file.originalname.split(".").pop();
    await this._blobStorage.uploadAsync(
      file.buffer,
      `${body.fileName}.${fileExtesion}`,
      "nestjs-azure-blob-storage"
    );

    response.sendStatus(201);
  }

  @Get()
  async getUri(@Query("name") fileName: string, @Res() response: Response) {
    const uri = await this._blobStorage.getUriAsync(
      fileName,
      "nestjs-azure-blob-storage"
    );
    response.status(200).json({ uri });
  }
}
