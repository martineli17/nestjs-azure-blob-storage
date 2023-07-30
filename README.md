# NestJS - Azure Blob Storage
<p>Quando se fala sobre armazenamento de arquivos em cloud, existem diversas maneiras de implementar. Uma dessas maneiras é utilizando o Azure Blob Storage.</p>
<p>O objetivo desse exemplo é utilizar o Azure Blob Storage em uma aplicação NestsJs.</p>

## Como usar
Primeiramente, é necessário instalar o pacote '[azure/storage-blob](https://www.npmjs.com/package/@azure/storage-blob)', que é responsável por fazer a interface com o serviço da Azure
<p>Neste exemplo, foi implementado um método para realizar o upload do arquivo e outro método para gerar uma URL de acesso ao arquivo desejado.</p>
  
- UPLOAD
<p>No método de upload, é necessário selecionar o container desejado. Caso ela não exista, o mesmo é criado em tempo de execução.</p>
<p>Após selecionar o container, é preciso executar o método responsável por realizar o upload do arquivo, informando: o nome do arquivo, o buffer, tamanho do buffer e uma função caso queira monitar o progresso do upload.</p>

```
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
```

- URL DE ACESSO
<p>No método de gerar a URL de acesso ao arquivo, é necessário selecionar o container desejado. Caso ela não exista, o mesmo é criado em tempo de execução.</p>
<p>Após isso, é preciso definir qual é o arquivo desejado, informando o nome do mesmo.</p>
<p>Feito isso, é feita a definição de algumas configurações para gerar a URL de acesso, como: tempo de expiração, o content type do arquivo, permissões.</p>

```
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
```

- No final, foi criada uma controller com endpoint para realizar o upload do arquivo e para retornar a URL de Acesso do arquivo desejado. [Arquivo](https://github.com/martineli17/nestjs-azure-blob-storage/blob/master/src/application/file.controller.ts)
