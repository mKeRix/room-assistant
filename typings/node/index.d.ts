declare namespace NodeJS {
    // drop-in hotfix for nest-emitter on Node 12, awaiting new version
    export interface Events extends EventEmitter {}
}
