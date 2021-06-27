<template>
  <n-data-table :columns="columns" :data="entities" :row-key="getRowKey"></n-data-table>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import Entity from "@/models/entity";
import { NDataTable } from "naive-ui";
import { TableColumns } from "naive-ui/lib/data-table/src/interface";
import { h } from "vue";
import EntityDetails from '@/components/EntityDetails.vue'

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
  columns: TableColumns<Entity> = [
    {
      type: 'expand',
      expandable: row => {
        return Object.keys(row.attributes).length > 0
      },
      renderExpand: row => {
        return h(
            EntityDetails,
            {
              entity: row
            }
        )
      }
    },
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
