import React from 'react';
import { Jumbotron, Container, Row,Col, Card, Button } from 'react-bootstrap';
import { useQuery, useMutation } from '@apollo/react-hooks';
import { REMOVE_BOOK } from '../utils/mutations';
import { GET_ME } from '../utils/queries';
import Auth from '../utils/auth';
import { removeBookId } from '../utils/localStorage';

const SavedBooks = () => {

  const { loading, data } = useQuery(GET_ME);
  const userData = data?.me || [];
  const [removeBook] = useMutation(REMOVE_BOOK);

  const handleDeleteBook = async (bookId) => {
    const token = Auth.loggedIn() ? Auth.getToken() : null;
    console.log(bookId);
    if (!token) {
      return false;
    }

    try {
      await removeBook({
        variables: { bookId: bookId }
      });

      removeBookId(bookId);
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return <h2>LOADING...</h2>;
  }

  return (
    <>
      <Jumbotron fluid className=' app-background-color'>
        <Container className=" margin-top-50px">
          <p className="title-lg">Viewing saved books!</p>
        </Container>
      </Jumbotron>
      <Container>
      <hr
        style={{
          
            height: 0
        }}
    />
        <p className="app-font-color title">
          {userData.savedBooks?.length
            ? ` ${userData.savedBooks.length} saved ${userData.savedBooks.length === 1 ? 'book' : 'books'}:`
            : '0 saved book!'}
        </p>
        
          {userData.savedBooks?.map((book) => {
            return (
              <Card key={book.bookId} className="card">
                 <Row>
                 <Col xs={3}>
                {book.image ? <Card.Img className="img" src={book.image} alt={`The cover for ${book.title}`} variant='top' /> : null}
                </Col>
                <Col xs={9}>
                <Card.Body>
                  <Card.Title>{book.title}</Card.Title>
                  <p className='small'>Authors: {book.authors}</p>
                  <Card.Text>{book.description}</Card.Text>
                  <Button className='btn-block btn-danger' onClick={() => handleDeleteBook(book.bookId)}>
                    Delete this Book!
                  </Button>
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

export default SavedBooks;
