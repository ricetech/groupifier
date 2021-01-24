export interface Participant {
  value: String;
  label: String;
}

export interface Session {
  RespondedParticipants: String;
  SessionDatetime: Number;
  SessionName: String;
  SessionStatus: any;
  SessionUID: String;
  TotalParticipants: String;
}
