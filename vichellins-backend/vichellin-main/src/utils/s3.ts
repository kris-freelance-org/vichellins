import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { defaultProvider } from '@aws-sdk/credential-provider-node';

class S3 {
  #client;

  constructor() {
    this.#client = new S3Client({
      credentials: defaultProvider()
    });
  }

  async putObject(key: string, data: Buffer, type: string) {
    const buffer = Buffer.from(data);

    await this.#client.send(
      new PutObjectCommand({
        Bucket: process.env.S3_BUCKET,
        Key: `${process.env.S3_KEY_PREFIX}/${key}`,
        ContentType: type,
        Body: buffer
      })
    );
  }

  async deleteObject(url: string, keyPathLength: number = 1) {
    const keyTokens = url.split('/');
    let keys = [];

    for (let i = keyPathLength; i > 0; i--) {
      keys.push(keyTokens[keyTokens.length - i]);
    }

    await this.#client.send(
      new DeleteObjectCommand({
        Bucket: process.env.S3_BUCKET,
        Key: keys.join('/')
      })
    );
  }

  fullUrl(key: string) {
    return `${process.env.S3_BASE_URL}/${process.env.S3_KEY_PREFIX}/${key}`;
  }
}

let s3: S3;

const getS3Instance = () => {
  if (!s3) {
    s3 = new S3();
  }

  return s3;
};

export default getS3Instance;
