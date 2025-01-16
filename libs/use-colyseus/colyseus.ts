import type { Schema } from "@colyseus/schema";
import { Client, type Room } from "colyseus.js";
import { useCallback, useRef, useState, useSyncExternalStore } from "react";
import { store } from "./store";

export const useColyseus = <S = Schema>(
  endpoint: string,
  schema?: new (...args: unknown[]) => S,
) => {
  const client = useRef(new Client(endpoint));
  const roomStore = useRef(store<Room<S> | undefined>(undefined));
  const stateStore = useRef(store<S | undefined>(undefined));
  const [connecting, setConnecting] = useState(false);

  const connectToColyseus = useCallback(
    async (roomName: string, options = {}) => {
      if (connecting || roomStore.current.get()) return;

      setConnecting(true);

      try {
        const room = await client.current.joinOrCreate<S>(
          roomName,
          options,
          schema,
        );
        await setCurrentRoom(room);
      } catch (e) {
        console.error("Failed to connect to Colyseus!");
        console.log(e);
      } finally {
        setConnecting(false);
      }
    },
    [connecting, schema],
  );

  const setCurrentRoom = useCallback(async (room: Room<S>) => {
    if (roomStore.current.get()) {
      await roomStore.current.get()?.leave(true);
    }

    roomStore.current.set(room);
    stateStore.current.set(room.state);

    const updatedCollectionsMap: { [key in keyof S]?: boolean } = {};

    for (const [key, value] of Object.entries(room.state as Schema)) {
      if (
        typeof value !== "object" ||
        !value.clone ||
        !value.onAdd ||
        !value.onRemove
      ) {
        continue;
      }

      updatedCollectionsMap[key as keyof S] = false;

      value.onAdd(() => {
        updatedCollectionsMap[key as keyof S] = true;
      });

      value.onRemove(() => {
        updatedCollectionsMap[key as keyof S] = true;
      });
    }

    room.onStateChange((state) => {
      if (!state) return;

      const copy = { ...state };

      for (const [key, update] of Object.entries(updatedCollectionsMap)) {
        if (!update) continue;

        updatedCollectionsMap[key as keyof S] = false;

        const value = state[key as keyof S] as unknown;

        if ((value as Schema).clone) {
          //@ts-ignore
          copy[key as keyof S] = value.clone();
        }
      }

      stateStore.current.set(copy);
    });
  }, []);

  const disconnectFromColyseus = useCallback(async (consented?: boolean) => {
    const room = roomStore.current.get();
    if (!room) return;

    roomStore.current.set(undefined);
    stateStore.current.set(undefined);

    try {
      await room.leave(consented);
      console.log("Disconnected from Colyseus!");
    } catch {}
  }, []);

  const sendMessage = useCallback(async <T>(messageType: string, data: T) => {
    const room = roomStore.current.get();
    if (!room) return;
    room.send(messageType, data);
  }, []);

  const useColyseusRoom = () => {
    const subscribe = (callback: () => void) =>
      roomStore.current.subscribe(() => callback());

    const getSnapshot = () => {
      return roomStore.current.get();
    };

    return useSyncExternalStore(subscribe, getSnapshot);
  };

  function useColyseusState(): S | undefined;
  function useColyseusState<T extends (state: S) => unknown>(
    selector: T,
  ): ReturnType<T> | undefined;
  function useColyseusState<T extends (state: S) => unknown>(selector?: T) {
    const subscribe = (callback: () => void) =>
      stateStore.current.subscribe(() => {
        callback();
      });

    const getSnapshot = () => {
      const state = stateStore.current.get();
      return state && selector ? selector(state) : state;
    };

    return useSyncExternalStore(subscribe, getSnapshot);
  }

  return {
    connectToColyseus,
    setCurrentRoom,
    disconnectFromColyseus,
    useColyseusRoom,
    useColyseusState,
    sendMessage,
  };
};
