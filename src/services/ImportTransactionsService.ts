import fs from 'fs';
import { join } from 'path';

import Transaction from '../models/Transaction';

import uploadConfig from '../config/upload';

import CreateTransactionService from './CreateTransactionService';

class ImportTransactionsService {
  async execute(filename: string): Promise<Transaction[]> {
    const path = uploadConfig.directory;

    const fileUrl = join(path, filename);

    const stream = fs
      .readFileSync(fileUrl, 'utf8')
      .split('\n')
      .map(row => row.split(','));

    const transactionsReadToInclude = stream.filter(
      row => row[0] !== 'title' && !!row[0],
    );

    const newTransactions: Transaction[] = [];

    // eslint-disable-next-line no-restricted-syntax
    for (const [title, type, value, category] of transactionsReadToInclude) {
      const createService = new CreateTransactionService();

      const typeParsed = type.trim() === 'income' ? 'income' : 'outcome';

      // eslint-disable-next-line no-await-in-loop
      const transaction = await createService.execute(
        {
          title: title.trim(),
          type: typeParsed,
          value: Number(value.trim()),
          category: category.trim(),
        },
        true,
      );

      newTransactions.push(transaction);
    }

    fs.unlinkSync(fileUrl);

    return newTransactions;
  }
}

export default ImportTransactionsService;
