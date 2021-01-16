CREATE TABLE Hosts (
    ID BIGSERIAL,
    FirebaseUID VARCHAR(128) UNIQUE,
    Name VARCHAR(64),
    Email VARCHAR(64) UNIQUE,
    PRIMARY KEY (ID)
);

CREATE TABLE Participants (
    ID BIGSERIAL,
    FirebaseUID VARCHAR(128) UNIQUE,
    Name VARCHAR(64),
    Email VARCHAR(64) UNIQUE,
    PRIMARY KEY (ID)
);

CREATE TABLE Sessions (
    ID BIGSERIAL,
    UID VARCHAR(128) UNIQUE,
    Name VARCHAR(64),
    HostID BIGINT,
    Datetime TIMESTAMP NOT NULL DEFAULT NOW(),
    Status VARCHAR(20),
    PRIMARY KEY (ID),
    FOREIGN KEY (HostID) REFERENCES HOSTS(ID)
);

CREATE TABLE Groups (
    ID BIGSERIAL,
    SessionID BIGINT,
    PRIMARY KEY (ID),
    FOREIGN KEY (SessionID) REFERENCES Sessions(ID)
);

CREATE TABLE ParticipantSessions (
    ParticipantID BIGINT,
    SessionID BIGINT,
    PRIMARY KEY (ParticipantID, SessionID),
    FOREIGN KEY (ParticipantID) REFERENCES Participants(ID),
    FOREIGN KEY (SessionID) REFERENCES Sessions(ID)
);

CREATE TABLE Rankings (
    SessionID BIGINT,
    SourceParticipantID BIGINT,
    TargetParticipantID BIGINT,
    RANK SMALLINT,
    PRIMARY KEY (SessionID, SourceParticipantID, TargetParticipantID),
    FOREIGN KEY (SourceParticipantID) REFERENCES Participants(ID),
    FOREIGN KEY (TargetParticipantID) REFERENCES Participants(ID)
);