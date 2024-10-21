import React, { useEffect } from 'react';
import './UserInput.css';
import { Button, Container, Form, InputGroup, ListGroup} from 'react-bootstrap';
import { useState } from 'react';

const UserInput = ({ setCoordinates }:any) => {
  const [location, setLocation] = useState<string>(''); // Keep user input
  const [predictionSelected, setPredictionSelected] = useState<boolean>(false);
  const [autoPredictions, setAutoPredictions] = useState<any[]>([]); // Keep Google autocomplete predictions

  const fetchPredictions = async () => {
    const response = await fetch('http://localhost:3005/autocomplete?input=' + location, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    });
    const data = await response.json();
    console.log(data);

    setAutoPredictions(data.suggestions); // Save predictions to the state
  }

  useEffect(() => {
    console.log('works');
    if (location.length > 3 && !predictionSelected) { // Send request to API with at least 3 characters
      fetchPredictions()
        .catch(console.error)

    } else {
      setAutoPredictions([]); // Clear predictions if input length is short
    }
  }, [location]);

  const handleInputChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const userInput = event.target.value;
    setPredictionSelected(false);
    setLocation(userInput);
  };

  // If the user selects an auto prediction, complete input field automatically
  const handleAutoPredictionClick = (prediction: string) => {
    setLocation(prediction);
    setPredictionSelected(true);
    setAutoPredictions([]); // Clear the predictions if a selection is made
  };

  // Get coordinates from backend after button is clicked
  const handleSubmit = async () => {
    if (!location) {
      alert("Please enter a location.");
      return;
    }

    try {
      const response = await fetch('http://localhost:3005/coordinates?address=' + location, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      console.log('Coordinates:', data);
      setCoordinates(data);

    } catch (error) {
      console.error('Error:', error);
    }
  }

  return (
    <Container fluid id="user-input-section">
      <div className="input-wrapper">
        <InputGroup >
          <Form.Control
            placeholder="From"
            aria-label="Recipient's username"
            aria-describedby="basic-addon2"
            type= "text"
            value={location}
            onChange={handleInputChange} // Listen user input and update the list
          />
          <Button onClick={handleSubmit} variant="success" id="button-addon2">
            Search
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-search ms-1 mb-1" viewBox="0 0 16 16">
              <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0"/>
            </svg>
          </Button>
        </InputGroup>

        {/* List group for predictions */}
        {autoPredictions.length > 0 && (
          <div className='list-group-container'>
            <ListGroup>
              {autoPredictions.map((autoPrediction) => (
                <ListGroup.Item
                  key={autoPrediction.placePrediction.placeId}
                  action
                  onClick={() => handleAutoPredictionClick(autoPrediction.placePrediction.text.text)}
                >
                  {autoPrediction.placePrediction.text.text}
                </ListGroup.Item>
              ))}
            </ListGroup>
          </div>
        )}
      </div>
    </Container>
  )
}

export default UserInput;