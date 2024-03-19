import { defineStore } from "pinia";
import VueCookies from "vue-cookies";
import api from "../services";

export const useUserStore = defineStore("UserStore", {
  state: () => ({
    user: null,
  }),
  getters: {
    isAuthenticated() {
      return !!this.user;
    },
  },
  actions: {
    async signUp({ email, password }) {
      try {
        const { data } = await api.post("sessions", { email, password });
        //primeiro parametro é o nome do token
        //segundo parametro é o token em si segundo
        //terceiro parametro é o expiration
        //quarto parametro é o path(quais caminhos terão acesso ao coockie)
        const { token, refreshToken } = data;

        //calculo para expirar em um token em 30 dias
        VueCookies.set("zitrus.token", token, 60 * 60 * 24 * 30, "/");
        VueCookies.set(
          "zitrus.refreshToken",
          refreshToken,
          60 * 60 * 24 * 30,
          "/"
        );

        this.user = data;

        (api.defaults.headers["Authorization"] = `Bearer ${token}`),
          this.router.push({ name: "about" });
      } catch (error) {
        console.error(error);
      }
    },
    signIn(email, password) {
      console.log(email, password);
    },
    async getMe() {
      const token = VueCookies.get("zitrus.token");

      if (token) {
        await api
          .get("/me", token)
          .then((response) => {
            this.user = response?.data;
          })
          .catch(() => {
            VueCookies.remove("zitrus.token");
            VueCookies.remove("zitrus.refreshToken");

            this.router.push({ name: "home" });
          });
      }
    },
  },
});
