import React, { useState, useEffect } from 'react';
    import ReactDOM from 'react-dom';

    const App = () => {
      const [channels, setChannels] = useState(['general', 'random']);
      const [activeChannel, setActiveChannel] = useState('general');
      const [messages, setMessages] = useState([]);
      const [inputValue, setInputValue] = useState('');

      useEffect(() => {
        const socket = new WebSocket('ws://localhost:8080');

        socket.onopen = () => {
          console.log('Connected to server');
        };

        socket.onmessage = (event) => {
          const message = JSON.parse(event.data);
          if (message.channel === activeChannel) {
            setMessages((prevMessages) => [...prevMessages, message]);
          }
        };

        socket.onclose = () => {
          console.log('Disconnected from server');
        };

        return () => {
          socket.close();
        };
      }, [activeChannel]);

      const handleSendMessage = () => {
        if (inputValue.trim() !== '') {
          const message = { channel: activeChannel, text: inputValue };
          setMessages((prevMessages) => [...prevMessages, message]);
          setInputValue('');

          // Send message to server
          const socket = new WebSocket('ws://localhost:8080');
          socket.onopen = () => {
            socket.send(JSON.stringify(message));
            socket.close();
          };
        }
      };

      return (
        <div className="container">
          <div className="channels">
            {channels.map((channel) => (
              <div
                key={channel}
                className={`channel ${activeChannel === channel ? 'active' : ''}`}
                onClick={() => setActiveChannel(channel)}
              >
                {channel}
              </div>
            ))}
          </div>
          <div className="chat">
            {messages.map((message, index) => (
              <div key={index} className="message">
                {message.text}
              </div>
            ))}
          </div>
          <div className="input-container">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              className="input"
            />
            <button onClick={handleSendMessage} className="send-button">
              Send
            </button>
          </div>
        </div>
      );
    };

    ReactDOM.render(<App />, document.getElementById('root'));
