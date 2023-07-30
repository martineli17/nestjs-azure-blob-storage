export interface IBlobStorage {
    uploadAsync(buffer: Buffer, fileName: string, containerName: string): Promise<void>;
    getUriAsync(fileName: string, containerName: string): Promise<string>;
}
