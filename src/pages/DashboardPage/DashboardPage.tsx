
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import { SessionCard } from '../../components/SessionCard/SessionCard';
export const DashboardPage = () => {

    return (
        <div>
            <SessionCard sessionName="Bob" sessionDate="Jan 9th" currentParticipants={4} totalParticipants={5} />

        </div>
    )
}