import { promises as fs } from 'fs';
import * as path from 'path';
import { Customer } from './customer.types';

const DATA_DIR = path.join(process.cwd(), 'data');
const FILE_PATH = path.join(DATA_DIR, 'customers.json');

export class CustomerRepository {
  async load(): Promise<Customer[]> {
    try {
      const data = await fs.readFile(FILE_PATH, 'utf-8');
      return JSON.parse(data) as Customer[];
    } catch {
      return []; // file doesn't exist yet
    }
  }

  async save(customers: Customer[]): Promise<void> {
    await fs.mkdir(DATA_DIR, { recursive: true }); // check if folder exists
    await fs.writeFile(FILE_PATH, JSON.stringify(customers, null, 2), 'utf-8');
  }

  async createOrUpdate(customer: Customer): Promise<void> {
    const customers = await this.load();
    const index = customers.findIndex(c => c.uid === customer.uid);

    if (index >= 0) {
      customers[index] = { ...customers[index], ...customer };
    } else {
      customers.push(customer);
    }

    await this.save(customers);
  }

  async findById(uid: string): Promise<Customer | null> {
    const customers = await this.load();
    return customers.find(c => c.uid === uid) || null;
  }
}
