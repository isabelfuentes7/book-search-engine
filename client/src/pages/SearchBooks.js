import React, { useState, useEffect } from 'react';
import { useMutation } from '@apollo/react-hooks';
import { Jumbotron, Container, Col, Form, Button, Card, Row   } from 'react-bootstrap';
import Auth from '../utils/auth';
import { searchGoogleBooks } from '../utils/API';
import { saveBookIds, getSavedBookIds } from '../utils/localStorage';
import { SAVE_BOOK } from '../utils/mutations';

const SearchBooks = () => {
  const [searchedBooks, setSearchedBooks] = useState([]);
  const [searchInput, setSearchInput] = useState('');
  const [savedBookIds, setSavedBookIds] = useState(getSavedBookIds());
  useEffect(() => {
    return () => saveBookIds(savedBookIds);
  });

  //  search books on click submit
  const handleFormSubmit = async (event) => {
    event.preventDefault();

    if (!searchInput) {
      return false;
    }

    try {
      const response = await searchGoogleBooks(searchInput);

      if (!response.ok) {
        throw new Error('Something went wrong! Please Try again after sometimes.');
      }

      const { items } = await response.json();

      const bookData = items.map((book) => ({
        bookId: book.id,
        authors: book.volumeInfo.authors || ['No author to display'],
        title: book.volumeInfo.title,
        description: book.volumeInfo.description,
        image: book.volumeInfo.imageLinks?.thumbnail || '',
      }));

      setSearchedBooks(bookData);
      setSearchInput('');
    } catch (err) {
      console.error(err);
    }
  };

  const [saveBook] = useMutation(SAVE_BOOK);

  const handleSaveBook = async (bookId) => {

    // find the book 
    const bookToSave = searchedBooks.find((book) => book.bookId === bookId);

    // get token
    const token = Auth.loggedIn() ? Auth.getToken() : null;

    if (!token) {
      return false;
    }

    try {
      console.log('bookToSave:', bookToSave);

      const { data } = await saveBook({
        variables: { bookData: { ...bookToSave } }
      });
      console.log('data:', data);

      setSavedBookIds([...savedBookIds, bookToSave.bookId]);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <Jumbotron  className=' app-background-color'>
        <Container>
          <p className="title-lg font-normal margin-top-50px">Search Books</p>
          <Form onSubmit={handleFormSubmit}>
            <Form.Row>
              <Col xs={12} md={8}>
                <Form.Control
                  name='searchInput'
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  type='text'
                  size='lg'
                  
                  placeholder='Search Book'
                />
              </Col>
              <Col xs={12} md={4}>
                <Button type='submit' className="app-button" variant='normal' size='lg'>
                  Submit Search
                </Button>
              </Col>
            </Form.Row>
          </Form>
      
        </Container>
        
      </Jumbotron>
      
      <Container className=' app-background-color'>
      <hr
        style={{
          
            height: 0
        }}
    />
        <p className="title">
          {searchedBooks.length
            ? ` ${searchedBooks.length} results:`
            : 'Search for a book '}
        </p>
          {searchedBooks.map((book) => {
            return (
              <Card key={book.bookId} className="card">
                 <Row>
                 <Col xs={3}>
                {book.image ? (
                  <Card.Img className="img" src={book.image} alt={`The cover for ${book.title}`} variant='top'  />
                ) : null}
                </Col>
                  <Col xs={9}>
                <Card.Body>
                  <Card.Title>{book.title}</Card.Title>
                  <p className='small'>Authors: {book.authors}</p>
                  <Card.Text>{book.description}</Card.Text>
                  {Auth.loggedIn() && (
                    <Button
                      disabled={savedBookIds?.some((savedBookId) => savedBookId === book.bookId)}
                      className='app-button btn-block'
                      onClick={() => handleSaveBook(book.bookId)}>
                      {savedBookIds?.some((savedBookId) => savedBookId === book.bookId)
                        ? 'This book has already been saved!'
                        : 'Save this Book!'}
                    </Button>
                  )}
                </Card.Body>
                </Col>
                 </Row>
              </Card>
            );
          })}
      </Container>
    </>
  );
};

export default SearchBooks;
