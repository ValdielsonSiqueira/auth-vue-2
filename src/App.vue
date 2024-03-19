<script>
import { mapActions } from "pinia";
import { useUserStore } from "./stores/UserStore";

export default {
  async created() {
    await this.getMe();
  },
  methods: {
    ...mapActions(useUserStore, ["getMe"]),
  },
};
</script>

<template>
  <router-view />
</template>
