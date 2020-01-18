import {I2cBusFuncs} from 'i2c-bus';

declare module 'i2c-bus' {
    export interface PromisifiedBus {
        /**
         * Promisified close.
         */
        close(): Promise<void>;

        /**
         * Determine functionality of the bus/adapter asynchronously.
         *
         * @return {Promise<I2cBusFuncs>}
         *     A frozen I2cFuncs object describing the I2C functionality available.
         */
        i2cFuncs(): Promise<I2cBusFuncs>;

        /**
         * Scans the I2C bus asynchronously for devices the same way <code>i2cdetect -y -r</code> would.
         *
         * @return {Promise<number[]>}
         *     An array of numbers where each number represents the I2C address of a device which was detected.
         */
        scan(): Promise<number[]>;

        /**
         * Asynchronous plain I2C read.
         *
         * @param {number} address
         *     I2C device address.
         * @param {number} length
         *     The number of bytes to read.
         * @param {Buffer} buffer
         *     The buffer that the data will be written to (must be at least {length} bytes long).
         * @return Promise<{bytesRead: number, buffer: Buffer}>
         *     The number of bytes read and the given buffer.
         */
        i2cRead(address: number, length: number, buffer: Buffer): Promise<{bytesRead: number, buffer: Buffer}>;

        /**
         * Asynchronous I2C block read (not defined by the SMBus
         * specification). Reads a block of bytes from a device, from a
         * designated register that is specified by cmd.
         *
         * @param {number} address
         *     I2C device address.
         * @param {number} command
         *     The command code.
         * @param {number} length
         *     The number of bytes to read (max 32).
         * @param {Buffer} buffer
         *     The buffer that the data will be written to (must be at least {length} bytes long).
         * @return Promise<{bytesRead: number, buffer: Buffer}>
         *     The number of bytes read and the given buffer.
         */
        readI2cBlock(address: number, command: number, length: number, buffer: Buffer): Promise<{bytesRead: number, buffer: Buffer}>;

        /**
         * Asynchronous plain I2C write.
         *
         * @param {number} address
         *     I2C device address.
         * @param {number} length
         *     The number of bytes to write.
         * @param {Buffer} buffer
         *     The buffer that the data to write (must contain at least {length} bytes).
         * @return Promise<{bytesWritten: number, buffer: Buffer}>
         *     The number of bytes written and the given buffer.
         */
        i2cWrite(address: number, length: number, buffer: Buffer): Promise<{bytesWritten: number, buffer: Buffer}>;

        /**
         * Asynchronous I2C block write (not defined by the SMBus
         * specification). Writes a block of bytes to a device, to a designated
         * register that is specified by {command}.
         *
         * @param {number} address
         *     I2C device address.
         * @param {number} command
         *     The command code.
         * @param {number} length
         *     The number of bytes to write (max 32).
         * @param {Buffer} buffer
         *     The buffer that the data to write (must contain at least {length} bytes).
         * @return Promise<{bytesWritten: number, buffer: Buffer}>
         *     The number of bytes written and the given buffer.
         */
        writeI2cBlock(address: number, command: number, length: number, buffer: Buffer): Promise<{bytesWritten: number, buffer: Buffer}>;
    }

    export function openPromisified(busNumber: number): Promise<PromisifiedBus>;
}
