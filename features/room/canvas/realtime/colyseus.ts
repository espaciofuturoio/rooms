import { colyseus } from '@/libs/use-colyseus'

import type { StudyRoomState } from './StudyRoomState.schema'
const serverWS = 'ws://localhost:2567'
export const studyRoom = colyseus<StudyRoomState>(serverWS)
