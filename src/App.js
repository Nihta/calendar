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
      <p className="mt-4 text-info text-center">@Nihta 2020 - 2022</p>
    </Container>
  );
}

export default App;
