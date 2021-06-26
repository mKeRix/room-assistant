<template>
  <div id="nav">
    <n-menu mode="horizontal" :options="menuOptions" :render-label="renderMenuLabel" />
  </div>
  <router-view/>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import { h, VNodeChild } from "vue";
import { RouterLink } from "vue-router";
import { MenuOption, NMenu } from "naive-ui";

@Options({
  components: {
    NMenu
  }
})
export default class App extends Vue {
  menuOptions = [
    {
      label: 'Home',
      key: '/'
    },
    {
      label: 'About',
      key: '/about'
    },
    {
      label: 'Entities',
      key: '/entities'
    }
  ]

  renderMenuLabel(option: MenuOption): VNodeChild {
    return h(
        RouterLink as never,
        {
          to: option.key
        },
        { default: () => option.label }
    )
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
}

#nav a.router-link-exact-active {
  color: #42b983;
}
</style>
