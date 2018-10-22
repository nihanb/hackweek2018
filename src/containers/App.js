import React, {Component} from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Main from '../components/Main';

class App extends Component {
  render() {
    return (
      <div className="App">
        <Header/>
        <div className="container" role="main">
          <Main/>
        </div>
        <Footer/>
      </div>
    );
  }
}

export default App;
