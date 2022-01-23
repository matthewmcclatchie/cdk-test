import {useEffect} from 'react';
import logo from './logo.svg';
import './App.css';

function App() {
  const testing = async () => {
    
    const req = await fetch(`${process.env.REACT_APP_CLOUDFRONT_URL}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: 'FROM FRONT END',
      }),
    })

    console.log('res', req)

    const res = await req.json()
    console.log('test response', res)
  }

  // const doit = async () => {
  //   const req = await fetch(`${process.env.REACT_APP_CLOUDFRONT_URL}/rsvp`, {
  //     method: 'POST',
  //     headers: {
  //       'Content-Type': 'application/json',
  //     },
  //     body: JSON.stringify({
  //       name: 'Steph Wharton',
  //       email: 'steph@test.com'
  //     }),
  //   })

  //   const res = await req.json()
  //   console.log('rsvp response', res)
  // }

  // const contactLambda = async () => {
  //   const req = await fetch(`${process.env.REACT_APP_CLOUDFRONT_URL}/contact`, {
  //     method: 'POST',
  //     headers: {
  //       'Content-Type': 'application/json',
  //     },
  //     body: JSON.stringify({
  //       name: 'Steph Wharton',
  //       email: 'steph@test.com',
  //       message: 'hello!!'
  //     }),
  //   })

  //   const res = await req.json()
  //   console.log('contact repsonse', res)
  // }

  useEffect(() => {
    testing()
    // doit()
    // contactLambda()
  }, [])

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload!!!
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
