<template>
<div id="entity-browser">
  <EntityList :entities="entities" />
</div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import EntityList from "@/components/EntityList.vue";
import axios from "axios";
import Entity from "@/models/entity";
import { isEntityUpdateMessage, SubscriptionRequestMessage } from "@/models/messages";

@Options({
  components: {
    EntityList
  }
})
export default class EntityBrowser extends Vue {
  private entityMap = new Map<string, Entity>()
  socket: WebSocket | null = null

  get entities(): Entity[] {
    return Array.from(this.entityMap.values())
  }

  async mounted(): Promise<void> {
    const entitiesResult = await axios.get<Entity[]>('/api/entities')
    this.entityMap = new Map<string, Entity>(entitiesResult.data.map(x => [x.id, x]))
  }

  created(): void {
    this.socket = new WebSocket(((window.location.protocol === "https:") ? "wss://" : "ws://") + window.location.host)

    this.socket.onmessage = ev => {
      const update = JSON.parse(ev.data)

      if (isEntityUpdateMessage(update)) {
        this.entityMap.set(update.entity.id, update.entity)
      }
    }
    this.socket.onopen = () => {
      this.socket?.send(JSON.stringify({
        event: 'subscribeEvents',
        data: {
          type: 'entityUpdates'
        }
      } as SubscriptionRequestMessage))
    }
  }
}
</script>

<style scoped>
#entity-browser {
  padding-left: 50px;
  padding-right: 50px;
}
</style>
