import React, { useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const SearchBox = () => {
  // State
  const [keyword, setKeyword] = useState('');

  // Route
  let navigate = useNavigate();

  // Methods
  const handleSubmit = (e) => {
    e.preventDefault();

    // trim whitespaces
    if (keyword.trim()) {
      navigate(`/search/${keyword}`);
    } else {
      navigate('/');
    }
  };

  const handleKeywordChange = (e) => {
    setKeyword(e.target.value);
  };

  return (
    <Form onSubmit={handleSubmit} className="d-flex">
      <Form.Control
        type="search"
        onChange={handleKeywordChange}
        placeholder="Search equipments..."
        className="me-2"
        size="sm"
      ></Form.Control>
      <Button
        type="submit"
        variant="outline-success"
        size="sm"
        className="me-2"
      >
        Search
      </Button>
    </Form>
  );
};

export default SearchBox;
