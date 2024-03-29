import axios from 'axios';
import { reactive, readonly } from 'vue';

interface AuthState {
  id: string;
  username: string;
  password: string;
  token: string;
}

interface AuthMutations {
  logout: () => boolean;
}

interface AuthActions {
  // login: (username: string, password: string) => boolean;
  login: (username: string, password: string) => Promise<boolean>;
}

interface UseAuth {
  state: AuthState;
  mutations: AuthMutations;
  actions: AuthActions;
}

const state: AuthState = reactive({
  id: '',
  username: 'Tanaka',
  password: '',
  token: 'a',
});

const mutations = {
  login(id: string, username: string, token: string) {
    state.id = id;
    state.username = username;
    state.token = token;
  },

  logout() {
    state.id = '';
    state.username = '';
    state.token = '';

    return true;
  },
};

const actions = {
  /* login(username: string, password: string) {
    console.log('Login', username, password);
    mutations.login('id', username, 'tokenAdmin');

    axios.get('https://jsonplaceholder.typicode.com/users').then((res) => {
      console.log('res', res);
    });

    return true;
  }, */

  async login(username: string, password: string) {
    console.log('Login', username, password);
    mutations.login('id', username, 'tokenAdmin');

    const res = await axios.get('https://jsonplaceholder.typicode.com/users');
    console.log('res', res);

    return true;
  },
};

export default function useAuth(): Readonly<UseAuth> {
  return readonly({
    state,
    mutations,
    actions,
  });
}
