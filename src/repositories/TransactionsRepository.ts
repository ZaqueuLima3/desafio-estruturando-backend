import { EntityRepository, Repository } from 'typeorm';

import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

@EntityRepository(Transaction)
class TransactionsRepository extends Repository<Transaction> {
  public async getBalance(): Promise<Balance> {
    const balance: Balance = {
      income: 0,
      outcome: 0,
      total: 0,
    };

    const initialValue = 0;

    const income = await this.find({ where: { type: 'income' } });
    const outcome = await this.find({ where: { type: 'outcome' } });

    balance.income = income.reduce(
      (accumulator, transaction) => accumulator + transaction.value,
      initialValue,
    );

    balance.outcome = outcome.reduce(
      (accumulator, transaction) => accumulator + transaction.value,
      initialValue,
    );

    balance.total = balance.income - balance.outcome;

    return balance;
  }
}

export default TransactionsRepository;
