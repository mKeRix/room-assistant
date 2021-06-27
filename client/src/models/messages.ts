import Entity from "@/models/entity";

export interface SubscriptionRequestMessage {
  event: 'subscribeEvents'
  data: { type: 'entityUpdates' }
}

export interface EntityUpdateMessage {
  entity: Entity
}

export function isEntityUpdateMessage(msg: unknown): msg is EntityUpdateMessage {
  return typeof msg == 'object' && msg != null && 'entity' in msg
}
