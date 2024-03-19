<template>
  <div>
    <span>About</span>
    <h4>{{ user }}</h4>
  </div>
</template>

<script>
import { useUserStore } from "../stores/UserStore";
import { mapState } from "pinia";
import api from "../services";

export default {
  name: "AboutView",
  computed: {
    ...mapState(useUserStore, ["user"]),
  },
  created() {
    api
      .get("/me")
      .then((response) => console.log(response))
      .catch((error) => console.log(error));
  },
};
</script>
