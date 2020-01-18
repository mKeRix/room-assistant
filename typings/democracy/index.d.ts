declare module 'democracy' {
    export default class Democracy {
        protected options: InternalOptions;

        constructor(opts?: Options);
        protected addNodeToList(node: Node);
        hello(): this;
        nodes(): Node[];
        leader(): Node;
        resign(): this;
        isLeader(): boolean;
        send(customEvent: object, extraData: object): this;
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
    }

}
