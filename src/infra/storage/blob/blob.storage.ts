import { BlobServiceClient, BlobSASPermissions } from "@azure/storage-blob";
import { IBlobStorage } from "./iblob.storage";
import { Injectable, Scope } from "@nestjs/common";

@Injectable({ scope: Scope.DEFAULT })
export class BlobStorage implements IBlobStorage {
  private readonly _serviceClient: BlobServiceClient;

  constructor(connectionString: string) {
    this._serviceClient =
      BlobServiceClient.fromConnectionString(connectionString);
  }

  async uploadAsync(
    buffer: Buffer,
    fileName: string,
    containerName: string
  ): Promise<void> {
    const container = this._serviceClient.getContainerClient(containerName);
    await container.createIfNotExists();
    await container.uploadBlockBlob(fileName, buffer, buffer.length, {
      onProgress(progress) {
        console.log(progress);
      },
    });
  }

  async getUriAsync(fileName: string, containerName: string): Promise<string> {
    const container = this._serviceClient.getContainerClient(containerName);
    const blobClient = container.getBlobClient(fileName);
    const expiresOn = new Date();
    expiresOn.setHours(expiresOn.getHours() + 1);
    const url = await blobClient.generateSasUrl({
      expiresOn,
      startsOn: new Date(),
      contentType: fileName.split(".").pop(),
      permissions: BlobSASPermissions.from({
        read: true,
      }),
    });
    
    return url;
  }
}
