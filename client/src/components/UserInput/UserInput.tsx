import React from 'react';
import './UserInput.css';
import { Button, Container, Form, InputGroup } from 'react-bootstrap';


const UserInput = () => {
  return (
    <Container fluid id="user-input-section">
      <div className="input-wrapper">
        <InputGroup className="mb-3">
          <Form.Control
            placeholder="From"
            aria-label="Recipient's username"
            aria-describedby="basic-addon2"
          />
          <Button variant="success" id="button-addon2">
            Search
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-search ms-1 mb-1" viewBox="0 0 16 16">
              <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0"/>
            </svg>
          </Button>
        </InputGroup>
      </div>
    </Container>
  )
}

export default UserInput;