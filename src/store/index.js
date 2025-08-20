import { createStore } from "vuex";
import player from "./modules/player";
import monster from "./modules/monster";
import log from "./modules/logs/index";
import user from './modules/user/index'
import { playerStoragePlugin } from "./plugins/playerStoragePlugin";
import { monsterStoragePlugin } from "./plugins/monsterStoragePlugin";



const store = createStore({
  modules: {
    player,
    monster,
    log,
    user,
  },
  plugins: [playerStoragePlugin, monsterStoragePlugin],
});

export default store;
