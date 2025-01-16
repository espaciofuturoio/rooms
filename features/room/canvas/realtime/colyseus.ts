import { colyseus } from '@/libs/use-colyseus'

import type { StudyRoomState } from './StudyRoomState.schema'
const serverWS = 'ws://localhost:2567'
// const serverWS = 'wss://dev-rooms-game-server-631092729836.us-central1.run.app'
export const {
    client,
    connectToColyseus,
    disconnectFromColyseus,
    useColyseusRoom,
    useColyseusState,
    sendMessage
  } = colyseus<StudyRoomState>(serverWS)
