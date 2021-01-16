import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import { LoginCard } from '../../components/LoginCard/LoginCard';
export const HomePage = () => {

    return (
        <Container className="HomeContainer">
            <Row className="RowContainer justify-content-md-center">
                <Col xs={4} className="align-self-center">
                    <LoginCard />
                </Col>
            </Row>
        </Container>
    )
}