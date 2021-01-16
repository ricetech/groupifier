CREATE TABLE HOST (
    ID BIGINT,
    FirebaseUID VARCHAR(128),
    Name VARCHAR(64),
    Email VARCHAR(64),
    PRIMARY KEY (ID)
);

CREATE TABLE Participants (
    ID BIGINT,
    FirebaseUID VARCHAR(128),
    Name VARCHAR(64),
    Email VARCHAR(64),
    PRIMARY KEY (ID)
);

CREATE TABLE Session (
    ID BIGINT,
    UID VARCHAR(128) UNIQUE,
    Name VARCHAR(64),
    HostID BIGINT,
    PRIMARY KEY (ID),
    FOREIGN KEY (HostID) REFERENCES HOST(ID)
);

CREATE TABLE Groups (
    ID BIGINT,
    SessionID BIGINT,
    PRIMARY KEY (ID),
    FOREIGN KEY (SessionID) REFERENCES Session(ID)
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