export class Device {
  address: string;
  name: string;
  manufacturer?: string;

  constructor(address: string, name: string) {
    this.address = address;
    this.name = name;
  }
}
