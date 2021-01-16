export interface CreateSessionRequest {
    HostName: string,
    HostEmail: string,
    SessionName: string,
    Participants: Array<{ParticipantName: string, ParticipantEmail: string}>
}
