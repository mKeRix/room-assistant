<template>
<p v-for="entity in entities" v-bind:key="entity.id">{{entity.name}}</p>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import Entity from "@/models/entity";

@Options({
  props: {
    entities: {
      type: Array as () => Array<Entity>,
      required: true,
      default: () => []
    }
  }
})
export default class EntityList extends Vue {
  entities!: Entity[]
}
</script>

<style scoped>

</style>
