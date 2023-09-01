import { Injectable } from '@nestjs/common';

type BcryptHashProps = {
  password: string;
};

type BcryptCompareProps = {
  password: string;
  hash: string;
};

@Injectable()
export class BcryptService {
  private readonly bcrypt = require('bcrypt');

  async hash({ password }: BcryptHashProps) {
    return await this.bcrypt.hash(password, 10);
  }

  async compare({ password, hash }: BcryptCompareProps) {
    return await this.bcrypt.compare(password, hash);
  }
}
