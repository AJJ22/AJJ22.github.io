import NavBar from './NavBar.js';
import { useGameLogic } from '../TextGames/textGame2019_driver.js';
import { useRef, useEffect } from 'react';

export function TextGame2019() {
    const messageEndRef = useRef(null);
    const {
            messages,
            inputValue,
            setInputValue,
            sendMessage,
            handleKeyDown,
    } = useGameLogic();

    useEffect(() => {
        if (messageEndRef.current) {
            messageEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages]);

    return(
        <div>
            <NavBar />
            
            <div className="page">
                <div className="message-container">
                    {messages.map((msg, index) => (
                        <div key={index} className={`message${msg.startsWith('>') ? ' user-command' : ''}`}>
                            {msg.split('\n').map((line, i) => (
                                <div key={i}>{line}</div>
                            ))}
                        </div>
                    ))}
                    <div ref={messageEndRef} />
                </div>

                <div className="input-area">
                    <input
                        id="input-box"
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyDown={handleKeyDown}
                        autoComplete='off'
                        placeholder="Enter a command..."
                    />
                    <button onClick={sendMessage}>Send</button>
                </div>
            </div>
        </div>
    );
}
export default TextGame2019;