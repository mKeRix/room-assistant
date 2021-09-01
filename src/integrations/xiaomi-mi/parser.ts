/**
 * This parser was originally ported from:
 *
 * https://github.com/hannseman/homebridge-mi-hygrothermograph/blob/master/lib/parser.js
 */
import * as crypto from 'crypto';

export const enum EventType {
  temperature = 4100,
  humidity = 4102,
  illuminance = 4103,
  moisture = 4104,
  fertility = 4105,
  battery = 4106,
  temperatureAndHumidity = 4109,
}

export class Event {
  type: EventType;
  value: number;
}

export class ServiceData {
  frameControl: FrameControl;
  protocolVersion: number;
  productId: number;
  productName: string;
  frameCounter: number;
  macAddress: string;
  capabilities: Capabilities;
  eventType?: EventType;
  eventLength?: number;
  events: Event[];
}

export const enum ProductId {
  HHCCJCV01 = 152,
  LYWSD03MMC = 1371,
  LYWSD02 = 1115,
  LYWSDCGQ = 426,
}

const ProductNames: { [index: number]: string } = {
  [ProductId.HHCCJCV01]: 'Mi Flora HHCCJCY01',
  [ProductId.LYWSD03MMC]: 'Mijia LYWSD03MMC',
  [ProductId.LYWSD02]: 'Mijia LYWSD02',
  [ProductId.LYWSDCGQ]: 'Miija LYWSDCGQ',
};

const FrameControlFlags = {
  isFactoryNew: 1 << 0,
  isConnected: 1 << 1,
  isCentral: 1 << 2,
  isEncrypted: 1 << 3,
  hasMacAddress: 1 << 4,
  hasCapabilities: 1 << 5,
  hasEvent: 1 << 6,
  hasCustomData: 1 << 7,
  hasSubtitle: 1 << 8,
  hasBinding: 1 << 9,
};

class FrameControl {
  isFactoryNew: boolean;
  isConnected: boolean;
  isCentral: boolean;
  isEncrypted: boolean;
  hasMacAddress: boolean;
  hasCapabilities: boolean;
  hasEvent: boolean;
  hasCustomData: boolean;
  hasSubtitle: boolean;
  hasBinding: boolean;
}

const CapabilityFlags = {
  connectable: 1 << 0,
  central: 1 << 1,
  secure: 1 << 2,
  io: (1 << 3) | (1 << 4),
};

class Capabilities {
  connectable: boolean;
  central: boolean;
  secure: boolean;
  io: boolean;
}

export class Parser {
  private buffer: Buffer;
  private readonly bindKey?: string;

  private baseByteLength = 5;
  private frameControl: FrameControl;
  private eventType: EventType;

  constructor(buffer: Buffer, bindKey: string | null = null) {
    if (buffer == null) {
      throw new Error('A buffer must be provided.');
    }
    this.buffer = buffer;
    if (buffer.length < this.baseByteLength) {
      throw new Error(
        `Service data length must be >= 5 bytes. ${this.toString()}`
      );
    }
    this.bindKey = bindKey;
  }

  parse(): ServiceData {
    this.frameControl = this.parseFrameControl();
    const protocolVersion = this.parseProtocolVersion();
    const productId = this.parseProductId();
    const productName = this.parseProductName();
    const frameCounter = this.parseFrameCounter();
    const macAddress = this.parseMacAddress();
    const capabilities = this.parseCapabilities();

    if (this.frameControl.isEncrypted) {
      this.decryptPayload();
    }

    this.eventType = this.parseEventType();
    const eventLength = this.parseEventLength();
    const events = this.parseEventData();
    return {
      frameControl: this.frameControl,
      protocolVersion,
      productId,
      productName,
      frameCounter,
      macAddress,
      capabilities,
      eventType: this.eventType,
      eventLength,
      events,
    };
  }

  parseFrameControl(): FrameControl {
    const frameControl = this.buffer.readUInt16LE(0);
    return Object.keys(FrameControlFlags).reduce((map, flag) => {
      map[flag] = (frameControl & FrameControlFlags[flag]) !== 0;
      return map;
    }, new FrameControl());
  }

  parseProtocolVersion(): number {
    return this.buffer.readUInt8(1) >> 4;
  }

  parseProductId(): number {
    return this.buffer.readUInt16LE(2);
  }

  parseProductName(): string {
    const id = this.parseProductId();
    return id in ProductNames ? ProductNames[id] : 'Unknown';
  }

  parseFrameCounter(): number {
    return this.buffer.readUInt8(4);
  }

  parseMacAddress(): string {
    if (!this.frameControl.hasMacAddress) {
      return null;
    }
    const macBuffer = this.buffer.slice(
      this.baseByteLength,
      this.baseByteLength + 6
    );
    return Buffer.from(macBuffer).reverse().toString('hex');
  }

  get capabilityOffset(): number {
    if (!this.frameControl.hasMacAddress) {
      return this.baseByteLength;
    }
    return 11;
  }

  parseCapabilities(): Capabilities {
    if (!this.frameControl.hasCapabilities) {
      return null;
    }
    const capabilities = this.buffer.readUInt8(this.capabilityOffset);
    return Object.keys(CapabilityFlags).reduce((map, flag) => {
      map[flag] = (capabilities & CapabilityFlags[flag]) !== 0;
      return map;
    }, new Capabilities());
  }

  get eventOffset(): number {
    let offset = this.baseByteLength;
    if (this.frameControl.hasMacAddress) {
      offset = 11;
    }
    if (this.frameControl.hasCapabilities) {
      offset += 1;
    }

    return offset;
  }

  parseEventType(): EventType | null {
    if (!this.frameControl.hasEvent) {
      return null;
    }
    return this.buffer.readUInt16LE(this.eventOffset);
  }

  parseEventLength(): number | null {
    if (!this.frameControl.hasEvent) {
      return null;
    }
    return this.buffer.readUInt8(this.eventOffset + 2);
  }

  decryptPayload(): void {
    const msgLength = this.buffer.length;
    const eventLength = msgLength - this.eventOffset;

    if (eventLength < 3) {
      return;
    }
    if (this.bindKey == null) {
      throw Error('Sensor data is encrypted. Please configure a bindKey.');
    }

    const encryptedPayload = this.buffer.slice(this.eventOffset, msgLength);

    const nonce = Buffer.concat([
      this.buffer.slice(5, 11), //mac_reversed
      this.buffer.slice(2, 4), //device_type
      this.buffer.slice(4, 5), //frame_cnt
      encryptedPayload.slice(-7, -4), //ext_cnt
    ]);

    const decipher = crypto.createDecipheriv(
      'aes-128-ccm',
      Buffer.from(this.bindKey, 'hex'), //key
      nonce, //iv
      { authTagLength: 4 }
    );

    const ciphertext = encryptedPayload.slice(0, -7);

    decipher.setAuthTag(encryptedPayload.slice(-4));
    decipher.setAAD(Buffer.from('11', 'hex'), {
      plaintextLength: ciphertext.length,
    });

    const receivedPlaintext = decipher.update(ciphertext);

    decipher.final();

    this.buffer = Buffer.concat([
      this.buffer.slice(0, this.eventOffset),
      receivedPlaintext,
    ]);
  }

  parseEventData(): Event[] | null {
    if (!this.frameControl.hasEvent) {
      return null;
    }
    switch (this.eventType) {
      case EventType.temperature: {
        return this.parseTemperatureEvent();
      }
      case EventType.humidity: {
        return this.parseHumidityEvent();
      }
      case EventType.battery: {
        return this.parseBatteryEvent();
      }
      case EventType.temperatureAndHumidity: {
        return this.parseTemperatureAndHumidityEvent();
      }
      case EventType.illuminance: {
        return this.parseIlluminanceEvent();
      }
      case EventType.fertility: {
        return this.parseFertilityEvent();
      }
      case EventType.moisture: {
        return this.parseMoistureEvent();
      }
      default: {
        throw new Error(
          `Unknown event type: ${this.eventType}. ${this.toString()}`
        );
      }
    }
  }

  parseTemperatureEvent(): Event[] {
    return [
      {
        type: EventType.temperature,
        value: this.buffer.readInt16LE(this.eventOffset + 3) / 10,
      },
    ];
  }

  parseHumidityEvent(): Event[] {
    return [
      {
        type: EventType.humidity,
        value: this.buffer.readUInt16LE(this.eventOffset + 3) / 10,
      },
    ];
  }

  parseBatteryEvent(): Event[] {
    return [
      {
        type: EventType.battery,
        value: this.buffer.readUInt8(this.eventOffset + 3),
      },
    ];
  }

  parseTemperatureAndHumidityEvent(): Event[] {
    return [
      {
        type: EventType.temperature,
        value: this.buffer.readInt16LE(this.eventOffset + 3) / 10,
      },
      {
        type: EventType.humidity,
        value: this.buffer.readUInt16LE(this.eventOffset + 5) / 10,
      },
    ];
  }

  parseIlluminanceEvent(): Event[] {
    return [
      {
        type: EventType.illuminance,
        value: this.buffer.readUIntLE(this.eventOffset + 3, 3),
      },
    ];
  }

  parseFertilityEvent(): Event[] {
    return [
      {
        type: EventType.fertility,
        value: this.buffer.readInt16LE(this.eventOffset + 3),
      },
    ];
  }

  parseMoistureEvent(): Event[] {
    return [
      {
        type: EventType.moisture,
        value: this.buffer.readInt8(this.eventOffset + 3),
      },
    ];
  }

  toString(): string {
    return this.buffer.toString('hex');
  }
}
