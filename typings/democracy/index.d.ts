declare module 'democracy' {
  import {Socket} from 'dgram';
  import Timeout = NodeJS.Timeout;

  export default class Democracy {
    protected options: InternalOptions;
    protected socket: Socket;
    protected _nodes: {[key: string]: Node};
    protected _id: string;
    protected _weight: number;
    protected _state: 'leader' | 'citizen' | 'removed';

    constructor(opts?: Options);
    protected addNodeToList(node: Node): void;
    protected checkBallots(candidate: string): this;
    protected processEvent(msg: Buffer): this;
    protected decodeMsg(msg: Buffer): Record<string, unknown>;
    hello(): this;
    nodes(): { [key: string]: Node };
    leader(): Node | undefined;
    resign(): this;
    isLeader(): boolean;
    holdElections(): this;
    send(customEvent: string, extraData?: any, id?: string): this;
    subscribe(channel: string): this;
    publish(channel: string, msg: any): this;
    on(event: string, func: (data: any) => void);
  }

  export class Options {
    interval?: number;
    timeout?: number;
    maxPacketSize?: number;
    source?: string;
    peers?: string[];
    weight?: number;
    id?: string;
    channels?: string[];
  }

  class InternalOptions {
    interval: number;
    timeout: number;
    maxPacketSize: number;
    source: string[];
    peers: string[][];
    weight: number;
    id: string;
    channels: string[];
  }

  export class Node {
    id: string;
    source: string;
    weight: number;
    state: string;
    last: Date;
    voters: string[];
    channels: string[];
    disconnected?: Timeout;
  }
}
