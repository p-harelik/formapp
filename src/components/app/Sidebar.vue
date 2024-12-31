<template>
  <nav>
    <v-navigation-drawer
      app
      dark
      mobile-breakpoint="0"
      :expand-on-hover="drawer"
      :mini-variant="drawer"
    >
      <v-list
        nav
        dense
      >
        <v-list-item-group
          v-model="selectedItem"
          color="primary"
        >
          <v-list-item
            v-for="(item, i) in items"
            :key="i"
            :to="item.url"
            :exact="item.exact"
          >
            <v-list-item-icon>
              <v-icon v-text="item.icon"></v-icon>
            </v-list-item-icon>

            <v-list-item-content>
              <v-list-item-title v-text="item.title"></v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list-item-group>
      </v-list>
    </v-navigation-drawer>
    <v-app-bar
            app
            height="64px"
            flat
            class="white app-bar"
    >
      <v-app-bar-nav-icon @click="setDrawer"></v-app-bar-nav-icon>
      <v-breadcrumbs
      :items="crumbs"
      divider="/"
      >
        <template v-slot:item="{ item }">
          <v-breadcrumbs-item
            :to="item.to"
            exact
            :disabled="item.disabled"
          >
            {{ item.text  }}
          </v-breadcrumbs-item>
        </template>
      </v-breadcrumbs>
    </v-app-bar>
  </nav>
</template>

<script>
import crumbs from '../../mixins/crumbs'

  export default {
    name: 'Sidebar',
    mixins: [crumbs],
    data: () => ({
      drawer: false,
      // crumbs: [],
      selectedItem: 0,
      items: [
        {
          title: 'Главная',
          url: '/',
          icon: 'mdi-home',
          exact: true
        },
        {
          title: 'Отдел закупок',
          url: '/purchasing-department',
          icon: 'mdi-cart-outline'
        },
        {
          title: 'Отдел логистики',
          url: '/logistics',
          icon: 'mdi-truck-fast-outline'
        },
        {
          title: 'Бухгалтерия',
          url: '/bookkeeping',
          icon: 'mdi-calculator'
        },
        {
          title: 'Реализация проектов',
          url: '/projects',
          icon: 'mdi-bulletin-board'
        },
        {
          title: 'Планирование в график отсутствий',
          url: '/planning-to-schedule',
          icon: 'mdi-calendar-month-outline'
        }
        // {
        //   title: 'Расчет PolyLED',
        //   url: '/polyled',
        //   icon: 'mdi-monitor-multiple'
        // },
        // {
        //   title: 'Расчет PolyWall',
        //   url: '/polywall',
        //   icon: 'mdi-tablet-dashboard'
        // }
      ]
    }),
    methods: {
      setDrawer () {
        this.drawer = !this.drawer
        localStorage.setItem('drawer', this.drawer)
      }
      // updateCrumbs() {
      //   let crumbs = [{
      //     text: 'Главная',
      //     to: '/'
      //   }]
      //   crumbs = crumbs.concat(this.$route.meta.breadcrumb)
      //   crumbs.push({ text: this.title, disabled: true })
      //   this.crumbs = crumbs
      // }
    },
    created () {
      if (localStorage.getItem('drawer') === 'true') {
        this.drawer = true
      } else {
        this.drawer = false
      }
    }
    // watch: {
    //   $route: {
    //     handler() {
    //       console.warn('update')
    //       this.updateCrumbs()
    //     },
    //     immediate: true
    //   }
    // }
  }
</script>

<style scoped lang="scss">
  .app-bar {
    border-bottom: 1px solid #BDBDBD !important;
  }
</style>

<!--<template>-->
<!--  <aside>-->
<!--    <v-navigation-drawer-->
<!--      permanent-->
<!--      width="100%">-->
<!--      <v-list>-->
<!--        <v-list-item>-->
<!--          <v-list-item-avatar>-->
<!--            <v-img src="https://cdn.vuetifyjs.com/images/john.png"></v-img>-->
<!--          </v-list-item-avatar>-->
<!--        </v-list-item>-->
<!--      </v-list>-->
<!--      <v-divider></v-divider>-->
<!--      <v-list-->
<!--        nav-->
<!--        dense-->
<!--      >-->
<!--        <v-list-item-group-->
<!--          v-model="selectedItem"-->
<!--          color="primary"-->
<!--          active-class="v-item&#45;&#45;active"-->
<!--        >-->
<!--          <v-list-item-->
<!--            v-for="(item, i) in items"-->
<!--            :key="i"-->
<!--            :to="item.url"-->
<!--            :exact="item.exact"-->
<!--            active-class="router-link-active"-->
<!--          >-->
<!--            <v-list-item-icon>-->
<!--              <v-icon v-text="item.icon"></v-icon>-->
<!--            </v-list-item-icon>-->

<!--            <v-list-item-content>-->
<!--              <v-list-item-title v-text="item.title"></v-list-item-title>-->
<!--            </v-list-item-content>-->
<!--          </v-list-item>-->
<!--        </v-list-item-group>-->
<!--      </v-list>-->
<!--    </v-navigation-drawer>-->
<!--  </aside>-->
<!--</template>-->

<!--<script>-->
<!--  export default {-->
<!--    name: 'Navbar',-->
<!--    data: () => ({-->
<!--      selectedItem: 0,-->
<!--      items: [-->
<!--        {-->
<!--          title: 'Главная',-->
<!--          url: '/',-->
<!--          icon: 'mdi-view-dashboard',-->
<!--          exact: true-->
<!--        },-->
<!--        {-->
<!--          title: 'Отдел закупок',-->
<!--          url: '/purchasing-department',-->
<!--          icon: 'mdi-image'-->
<!--        },-->
<!--        {-->
<!--          title: 'Отдел логистики',-->
<!--          url: '/logistics',-->
<!--          icon: 'mdi-help-box'-->
<!--        },-->
<!--        {-->
<!--          title: 'Запрос ресурсов',-->
<!--          url: '/resources',-->
<!--          icon: 'mdi-help-box'-->
<!--        }-->
<!--      ]-->
<!--    })-->
<!--  }-->
<!--</script>-->
