<template>
  <div class="entity-details">
    <div class="entity-attributes" v-if="Object.keys(entity.attributes).length > 0">
      <n-element
          tag="span"
          style="font-weight: var(--th-font-weight); font-size: 18px; line-height: var(--line-height); margin-bottom: 16px; color: var(--th-text-color);"
      >
        Attributes
      </n-element>
      <div v-for="(value, key) in entity.attributes" v-bind:key="key">
        <n-element
            tag="span"
            style="font-weight: var(--th-font-weight); line-height: var(--line-height); color: var(--th-text-color);"
        >
          {{key}}:
        </n-element>
        <span>{{value}}</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import Entity from "../models/entity";
import { NElement } from "naive-ui";

@Options({
  props: {
    entity: {
      type: Object as () => Entity
    }
  },
  components: {
    NElement
  }
})
export default class EntityDetails extends Vue {
  entity!: Entity
}
</script>

<style scoped>

</style>
