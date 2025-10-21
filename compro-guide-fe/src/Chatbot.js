import React, { useState, useEffect, useRef } from 'react';

export default function Chatbot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { id: 1, from: 'bot', text: 'Hi! I can help with site navigation or answer simple questions. Try "how to add a course".' }
  ]);
  const [input, setInput] = useState('');
  const listRef = useRef(null);

  useEffect(() => {
    if (open && listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [open, messages]);

  function sendMessage(e) {
    e && e.preventDefault && e.preventDefault();
    const text = input.trim();
    if (!text) return;
    const id = Date.now();
    setMessages(prev => [...prev, { id, from: 'user', text }]);
    setInput('');
    // call backend AI API
    (async () => {
      try {
        const url = '/api/ai/bot?prompt=' + encodeURIComponent(text);
        const resp = await fetch(url);
        if (!resp.ok) throw new Error(`Request failed: ${resp.status} ${resp.statusText}`);
        // expect a plain string response or JSON { reply: '...' }
        let replyText = await resp.text();
        setMessages(prev => [...prev, { id: id + 1, from: 'bot', text: replyText || "(no reply)" }]);
      } catch (err) {
        console.log(err);
        setMessages(prev => [...prev, { id: id + 1, from: 'bot', text: "Sorry, I couldn't reach the assistant right now." }]);
      }
    })();
  }

  function autoReply(text) {
    const t = text.toLowerCase();
    if (t.includes('course')) return 'To view courses, open the Courses page from the top navigation.';
    if (t.includes('blog')) return 'You can browse or create blog posts on the Blog page.';
    if (t.includes('review')) return 'Open a course and click "Add a review" to submit feedback.';
    if (t.includes('hi') || t.includes('hello')) return 'Hello! How can I help?';
    return "Sorry, I'm a simple helper — try asking about Courses, Blog, or Reviews.";
  }

  return (
    <div className={`chatbot ${open ? 'open' : ''}`}>
      <div className="chatbot-button" onClick={() => setOpen(o => !o)} aria-label="Toggle chat">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M21 15a2 2 0 0 1-2 2H8l-5 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
      </div>

      {open && (
        <div className="chatbot-panel" role="region" aria-label="Chatbot panel">
          <div className="chatbot-header">
            <div>Compro Helper</div>
            <button className="btn" onClick={() => setOpen(false)}>Close</button>
          </div>

          <div className="chatbot-list" ref={listRef}>
            {messages.map(m => (
              <div key={m.id} className={`chatbot-msg ${m.from === 'bot' ? 'bot' : 'user'}`}>
                <div className="chatbot-msg-text">{m.text}</div>
              </div>
            ))}
          </div>

          <form className="chatbot-input-row" onSubmit={sendMessage}>
            <input className="input" placeholder="Type a message" value={input} onChange={e => setInput(e.target.value)} />
            <button className="btn primary" type="submit">Send</button>
          </form>
        </div>
      )}
    </div>
  );
}
