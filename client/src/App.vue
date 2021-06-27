<template>
  <n-config-provider :theme="context.theme">
    <n-global-style />
    <div id="nav">
      <n-menu mode="horizontal" :options="menuOptions" :render-label="renderMenuLabel" />
    </div>
    <router-view/>
  </n-config-provider>
</template>

<script lang="ts">
import { Options, setup, Vue } from "vue-class-component";
import { computed, h, VNodeChild } from "vue";
import { RouterLink } from "vue-router";
import { darkTheme, MenuOption, NConfigProvider, NGlobalStyle, NMenu, useOsTheme } from "naive-ui";

@Options({
  components: {
    NMenu,
    NConfigProvider,
    NGlobalStyle
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

  context = setup(() => {
    const osThemeRef = useOsTheme()
    return {
      theme: computed(() => (osThemeRef.value === 'dark' ? darkTheme : null)),
      osTheme: osThemeRef
    }
  })

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
