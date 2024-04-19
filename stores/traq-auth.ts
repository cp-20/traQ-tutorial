import { defineStore } from 'pinia';
import {
  Api,
  type Channel,
  type FullRequestParams,
  type MyUserDetail,
} from 'traq-bot-ts';

const api = new Api();

type AuthStore = {
  me: MyUserDetail | null;
  accessToken: string | null;
  accessTokenEnsured: boolean;
};

const getSpecificChannel = async (channels: Channel[], path: string) => {
  const names = path.split('/');
  const rootName = names.shift();
  let channel = channels.find(
    (c) => c.name === rootName && c.parentId === null
  )!;
  for (const name of names) {
    channel = channel.children
      .map((child) => channels.find((c) => c.id === child)!)
      .find((c) => c.name === name)!;
  }
  return channel;
};

export const useTraqAuthStore = defineStore(
  'TraqAuth',
  () => {
    const state = ref<AuthStore>({
      me: null,
      accessToken: null,
      accessTokenEnsured: false,
    });

    const props = computed<Omit<FullRequestParams, 'path'>>(() => ({
      headers: { Authorization: `Bearer ${state.value.accessToken}` },
      credentials: 'omit',
    }));

    const actions = {
      getMe: async (): Promise<boolean> => {
        if (state.value.accessToken === null) return false;
        const res = await api.users.getMe(props.value);
        if (!res.ok) return false;

        const me = res.data;
        state.value.me = me;

        return true;
      },
      isHomeChannelSet: async (): Promise<boolean> => {
        return !!state.value.me?.homeChannel;
      },
      getMyTimes: async (): Promise<Channel | null> => {
        if (state.value.accessToken === null) return null;
        const res = await api.channels.getChannels(
          { 'include-dm': false },
          props.value
        );
        if (!res.ok) return null;

        const channels = res.data.public;

        const timesChannel = await getSpecificChannel(channels, 'gps/times');

        return (
          timesChannel.children
            .map((child) => channels.find((c) => c.id === child)!)
            .find(
              (c) =>
                c.name === state.value.me?.name &&
                state.value.me.homeChannel === c.id
            ) ?? null
        );
      },
      isTimesCreated: async (): Promise<boolean> => {
        return (await actions.getMyTimes()) !== null;
      },
      isIntroductionSet: async (): Promise<boolean> => {
        if (state.value.accessToken === null) return false;
        const res = await api.channels.getChannels(
          { 'include-dm': false },
          props.value
        );
        if (!res.ok) return false;

        const channels = res.data.public;
        const introductionChannel = await getSpecificChannel(
          channels,
          'random/jikoshokai'
        );

        const introductionMessage = await api.messages.searchMessages(
          { from: state.value.me?.id, in: introductionChannel.id },
          props.value
        );

        return introductionMessage.data.hits.length > 0;
      },
      isEnoughPosts: async (border: number): Promise<boolean> => {
        if (state.value.accessToken === null) return false;
        const res = await api.messages.searchMessages(
          {
            from: state.value.me?.id,
            limit: 100,
          },
          props.value
        );
        if (!res.ok) return false;

        return res.data.hits.length >= border;
      },
      createTimes: async (): Promise<boolean> => {
        if (state.value.accessToken === null) return false;
        if (state.value.me === null) return false;

        const res = await api.channels.getChannels(
          { 'include-dm': false },
          props.value
        );
        if (!res.ok) return false;

        const channels = res.data.public;
        const timesChannel = await getSpecificChannel(channels, 'gps/times');

        const res2 = await api.channels.createChannel(
          {
            name: state.value.me?.name,
            parent: timesChannel.id,
          },
          props.value
        );
        if (!res2.ok) return false;

        return true;
      },
      setHomeChannel: async (): Promise<boolean> => {
        if (state.value.accessToken === null) return false;
        if (state.value.me === null) return false;

        const res = await actions.getMyTimes();
        if (res === null) return false;

        const res2 = await api.users.editMe(
          { homeChannel: res.id },
          props.value
        );
        if (!res2.ok) return false;

        return true;
      },
      ensureToken: async () => {
        if (state.value.accessToken === null) return;
        if (state.value.accessTokenEnsured) return;

        const success = await actions.getMe();
        if (!success) {
          state.value.accessToken = null;
          return;
        }

        state.value.accessTokenEnsured = true;
      },
    };

    return {
      state,
      actions,
    };
  },
  { persist: true }
);
