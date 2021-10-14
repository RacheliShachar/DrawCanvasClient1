import logo from './logo.svg';
import './App.css';
import React, { useState } from 'react';
import socketClient from "socket.io-client";
import CanvasBoard from './canvas/CanvasBoard';
import { Form, Button } from 'react-bootstrap';
const SERVER = "http://127.0.0.1:8080";
const STATIC_CHANNELS = ['global_notifications', 'global_chat'];

function App() {
  const [isLogin, setIsLogin] = useState(true)
  const [name, setName] = useState("");
  let participantsArr = [];
  const saveParticipant = (name) => {
    participantsArr.pop({ id: participantsArr.length, name: name })
    setIsLogin(false)
  }
  return (
    <div className="App d-flex justify-content-center align-items-center mt-5" >
      {
        isLogin ?
          <Form style={{width:"30vh"}}>
            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label>Name:</Form.Label>
              <Form.Control type="text" placeholder="Enter Name"  onChange={(e) => {
                debugger; 
                setName(e.target.value) }}/>
            </Form.Group>
            <Button variant="primary" type="submit" onClick={(e)=>{saveParticipant(name)}}  >
              Save User
            </Button>
          </Form>
          :
          <CanvasBoard name={name}/>

      }
    </div>
  );
}

export default App;
