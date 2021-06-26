<template>
  <n-data-table :columns="columns" :data="entities" :row-key="getRowKey"></n-data-table>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import Entity from "@/models/entity";
import { NDataTable } from "naive-ui";

@Options({
  props: {
    entities: {
      type: Array as () => Array<Entity>,
      required: true,
      default: () => []
    }
  },
  components: {
    NDataTable
  }
})
export default class EntityList extends Vue {
  entities!: Entity[]
  columns = [
    {
      title: 'ID',
      key: 'id'
    },
    {
      title: 'Name',
      key: 'name'
    },
    {
      title: 'State',
      key: 'state'
    }
  ]

  getRowKey(entity: Entity): string {
    return entity.id
  }
}
</script>

<style scoped>

</style>
