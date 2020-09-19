import React from "react";
import "./App.css";
import Timetable from "./components/Timetable";
import { Container, Row, Col } from "react-bootstrap";

function App() {
  return (
    <Container className="container">
      <Row>
        <Col>
          <Timetable />
        </Col>
      </Row>
    </Container>
  );
}

export default App;
