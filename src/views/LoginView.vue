<template>
  <form class="flex" @submit.prevent="onSubmit">
    <input v-model="form.email" type="email" />
    <input v-model="form.password" type="password" />
    <button type="submit">Entrar</button>
  </form>
</template>

<script>
import { useUserStore } from "../stores/UserStore";
import { mapActions } from "pinia";

export default {
  name: "LoginView",
  data() {
    return {
      form: {},
    };
  },
  methods: {
    onSubmit() {
      this.signUp(this.form);
    },
    ...mapActions(useUserStore, ["signUp"]),
  },
};
</script>

<style lang="scss">
@import "@/style/index.scss";
</style>
