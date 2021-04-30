table! {
    groups (id) {
        id -> Int4,
        sessionid -> Int4,
    }
}

table! {
    hosts (id) {
        id -> Int4,
        firebaseuid -> Varchar,
        name -> Varchar,
        email -> Varchar,
    }
}

table! {
    participantgroups (sessionid, participantid, groupid) {
        sessionid -> Int4,
        participantid -> Int4,
        groupid -> Int4,
    }
}

table! {
    participants (id) {
        id -> Int4,
        firebaseuid -> Varchar,
        name -> Varchar,
        email -> Varchar,
    }
}

table! {
    participantsessions (participantid, sessionid) {
        participantid -> Int4,
        sessionid -> Int4,
    }
}

table! {
    rankings (sessionid, sourceparticipantid, targetparticipantid) {
        sessionid -> Int4,
        sourceparticipantid -> Int4,
        targetparticipantid -> Int4,
        rank -> Int2,
    }
}

table! {
    sessions (id) {
        id -> Int4,
        uid -> Varchar,
        name -> Varchar,
        hostid -> Int4,
        groupsize -> Int4,
        datetime -> Timestamp,
        status -> Varchar,
    }
}

joinable!(groups -> sessions (sessionid));
joinable!(participantgroups -> groups (groupid));
joinable!(participantgroups -> participants (participantid));
joinable!(participantgroups -> sessions (sessionid));
joinable!(participantsessions -> participants (participantid));
joinable!(participantsessions -> sessions (sessionid));
joinable!(sessions -> hosts (hostid));

allow_tables_to_appear_in_same_query!(
    groups,
    hosts,
    participantgroups,
    participants,
    participantsessions,
    rankings,
    sessions,
);
