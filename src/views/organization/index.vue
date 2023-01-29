<template>
  <div class="wrapper-sm">
    <page-list v-if="isTreePage" @goTree="goTree"></page-list>
    <tree-list v-else @goPage="goPage"></tree-list>
  </div>
</template>

<script>
import pageList from './pageList';
import treeList from './treeList';
export default {
  components: {
    pageList,
    treeList
  },
  data () {
    return {
      isTreePage: true
    };
  },
  methods: {
    goTree () {
      this.isTreePage = false
    },
    goPage () {
      this.isTreePage = true
    }
  }
};
</script>

<style lang="scss" scoped>
.wrapper-sm {
  background: #f5f7f9;
  height: 100%;
  overflow-y: auto;
  box-sizing: border-box
}
</style>
