import { promises as fs } from 'fs';
import * as path from 'path';
import { Customer } from './customer.types';

const DATA_DIR = path.join(process.cwd(), 'data');
const FILE_PATH = path.join(DATA_DIR, 'customers.json');

/**
 * Repository for managing customer data stored in a JSON file.
 * Provides methods to load, save, create/update, and query customers.
 */
export class CustomerRepository {
  /**
   * Loads all customers from the JSON file.
   * 
   * @returns {Promise<Customer[]>} An array of all customers. Returns an empty array if the file does not exist.
   */
  async load(): Promise<Customer[]> {
    try {
      const data = await fs.readFile(FILE_PATH, 'utf-8');
      return JSON.parse(data) as Customer[];
    } catch {
      return []; // file doesn't exist yet
    }
  }

  /**
   * Saves the given array of customers to the JSON file.
   * Creates the data directory if it does not exist.
   * 
   * @param {Customer[]} customers - The array of customers to save.
   * @returns {Promise<void>}
   */
  async save(customers: Customer[]): Promise<void> {
    await fs.mkdir(DATA_DIR, { recursive: true }); // ensure folder exists
    await fs.writeFile(FILE_PATH, JSON.stringify(customers, null, 2), 'utf-8');
  }

  /**
   * Creates a new customer or updates an existing one.
   * 
   * If a customer with the same UID exists, its data is merged with the new data.
   * Otherwise, the customer is added to the list.
   * 
   * @param {Customer} customer - The customer to create or update.
   * @returns {Promise<void>}
   */
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

  /**
   * Finds a customer by their UID.
   * 
   * @param {string} uid - The UID of the customer to find.
   * @returns {Promise<Customer | null>} The customer object if found, or null if not found.
   */
  async findById(uid: string): Promise<Customer | null> {
    const customers = await this.load();
    return customers.find(c => c.uid === uid) || null;
  }
}
