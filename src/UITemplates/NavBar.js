import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';

function navBar() {
  return (
    <div class="navbar navbar-dark fixed-top bg-dark">
      <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-1BmE4kWBq78iYhFldvKuhfTAU6auU8tT94WrHftjDbrCEXSU1oBoqyl2QvZ6jIW3" crossorigin="anonymous"></link>

      <Navbar expand="lg" className="nav">
        <Container className="container-fluid">
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link className="navLink" href="/#/Home">Home</Nav.Link>
              <Nav.Link className="navLink" href="/#/Education">Education</Nav.Link>
              <Nav.Link className="navLink" href="/#/experience">Experience</Nav.Link>
              <Nav.Link className="navLink" href="/#/Contact">Contact</Nav.Link>
              <Nav.Link className="navLink" href="/#/TextGame2019">Text Game 2019</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </div>
  );
}

export default navBar;