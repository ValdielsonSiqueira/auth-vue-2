//recuperando token para autenticação das requisições
//seta de forma default o token
//versão do axios para isso aqui da certo tem que ser a 0.27.2

import { set, get } from "vue-cookies";
import axios from "axios";

let isRefreshing = false;
let failedRequestQueue = [];

const api = axios.create({
  baseURL: import.meta.env.VITE_API,
  headers: {
    Authorization: `Bearer ${get("zitrus.token")}`,
  },
});

//usando interceptors para verificar validação do token nas chamadas

api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    //preciso que caso o token seja expirado, me retorne diretamente o erro relacionado
    //criar fila de requisições enquanto o token esta sendo atualizado
    //o isRefreshing servira para criar o cenario de somente uma requisição sendo feita para o refresh
    if (error?.response?.status === 401) {
      if (error.response.data?.code === "token.expired") {
        //renovar token
        const refreshToken = get("zitrus.refreshToken");
        const originalConfig = error.config; //todas as configurações necessarias pra chamar a requisição novamente

        if (!isRefreshing) {
          isRefreshing = true;

          api
            .post("/refresh", {
              refreshToken,
            })
            .then((response) => {
              const { token } = response.data;

              set("zitrus.token", token, 60 * 60 * 24 * 30, "/");
              set(
                "zitrus.refreshToken",
                response.data.refreshToken,
                60 * 60 * 24 * 30,
                "/"
              );

              api.defaults.headers["Authorization"] = `Bearer ${token}`;

              //passando pelas request

              failedRequestQueue.forEach((request) => request.onSuccess(token));
              failedRequestQueue = [];
            })
            .catch((error) => {
              failedRequestQueue.forEach((request) => request.onFailure(error));
              failedRequestQueue = [];
            })
            .finally(() => {
              isRefreshing = false;
            });
        }
        //CRIANDO FILA
        return new Promise((resolve, reject) => {
          failedRequestQueue.push({
            onSuccess: (token) => {
              (originalConfig.headers["Authorization"] = `Bearer ${token}`),
                resolve(api(originalConfig));
            },
            onFailure: (error) => {
              reject(error);
            },
          });
        });
      } else {
        //deslogar user
      }
    }
  }
);

export default api;
