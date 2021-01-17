export interface ParticipantDB {
  id: number;
  firebaseuid: string;
  name: string;
  email: string;
}

export interface RankingsDB {
  sessionid: number;
  sourceparticipantid: number;
  targetparticipantid: number;
  rank: number;
}
