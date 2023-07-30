import { Module, Provider } from "@nestjs/common";
import { FileController } from "../../application/file.controller";
import { BlobStorage } from "../storage/blob/blob.storage";
import { ConfigModule } from "@nestjs/config";

const BLOB_STORAGE_PROVIDER_CONFIG: Provider<BlobStorage> = {
  provide: BlobStorage,
  useFactory: async () => {
    return new BlobStorage(process.env.CONNECTION_STRING_BLOB_STORAGE);
  }
};

@Module({
  imports: [ConfigModule.forRoot({
    envFilePath: ['.local.env']
  })],
  controllers: [FileController],
  providers: [BLOB_STORAGE_PROVIDER_CONFIG],
})
export class AppModule {}
