import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

type BcryptHashProps = {
  password: string;
};

type BcryptCompareProps = {
  password: string;
  hash: string;
};

@Injectable()
export class BcryptService {
  async hash({ password }: BcryptHashProps) {
    return await bcrypt.hash(password, 10);
  }

  async compare({ password, hash }: BcryptCompareProps) {
    return await bcrypt.compare(password, hash);
  }
}
