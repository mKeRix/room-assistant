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

@Options({
  components: {
    EntityList
  }
})
export default class EntityBrowser extends Vue {
  entities: Entity[] = []

  async mounted(): Promise<void> {
    const entitiesResult = await axios.get('/api/entities')
    this.entities = entitiesResult.data
  }
}
</script>

<style scoped>
#entity-browser {
  padding-left: 50px;
  padding-right: 50px;
}
</style>
