import { Schema, Context, type } from "@colyseus/schema";

export class StudyRoomState extends Schema {

  @type("string") mySynchronizedProperty = "Hello world";

}
