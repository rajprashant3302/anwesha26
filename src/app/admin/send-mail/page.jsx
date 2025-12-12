"use client";
import { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebaseConfig';

export default function SendMailPage() {
  const [target, setTarget] = useState('all'); // 'all' or 'event'
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState('');
  
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const snap = await getDocs(collection(db, "events"));
        
        const eventList = snap.docs.map(doc => ({ 
          id: doc.id,                   
          name: doc.data().Name || doc.data().name || "Unnamed Event"
        }));
        
        setEvents(eventList);
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };
    fetchEvents();
  }, []);

  const handleSend = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: target,
          eventId: selectedEvent, // Sends "0001" if selected
          subject,
          message
        }),
      });

      const data = await res.json();
      if (data.success) {
        alert(`Success! Email sent to ${data.count} users.`);
        setSubject('');
        setMessage('');
      } else {
        alert("Failed: " + data.message);
      }
    } catch (error) {
      console.error(error);
      alert("Something went wrong.");
    }
    setLoading(false);
  };

  return (
    <div className="max-w-3xl mx-auto mt-[7rem] p-6 bg-white rounded-lg shadow-md border border-gray-100">
      <div className="border-b pb-4 mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Broadcast Mailer</h1>
        <p className="text-gray-500 text-sm">Send updates to all users or specific event participants.</p>
      </div>
      
      <form onSubmit={handleSend} className="space-y-6">
        
        {/* Target Selection */}
        <div>
          <label className="block text-gray-700 font-bold mb-3">Audience</label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <label className={`flex items-center p-4 border rounded-lg cursor-pointer transition ${target === 'all' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:bg-gray-50'}`}>
              <input 
                type="radio" 
                name="target" 
                value="all" 
                checked={target === 'all'} 
                onChange={() => setTarget('all')}
                className="w-5 h-5 text-blue-600 mr-3"
              />
              <span className="font-medium">All Registered Users</span>
            </label>
            
            <label className={`flex items-center p-4 border rounded-lg cursor-pointer transition ${target === 'event' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:bg-gray-50'}`}>
              <input 
                type="radio" 
                name="target" 
                value="event" 
                checked={target === 'event'} 
                onChange={() => setTarget('event')}
                className="w-5 h-5 text-blue-600 mr-3"
              />
              <span className="font-medium">Specific Event Participants</span>
            </label>
          </div>
        </div>

        {/* Event Dropdown (Dynamic) */}
        {target === 'event' && (
          <div className="animate-fade-in-down">
            <label className="block text-gray-700 font-bold mb-2">Select Event</label>
            <select 
              required={target === 'event'}
              value={selectedEvent}
              onChange={(e) => setSelectedEvent(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none bg-white"
            >
              <option value="">-- Select an Event --</option>
              {events.map(event => (
                <option key={event.id} value={event.id}>
                  {event.name} (ID: {event.id})
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Email Content */}
        <div>
          <label className="block text-gray-700 font-bold mb-2">Subject Line</label>
          <input 
            type="text" 
            required
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="e.g. Schedule Change for Dance Competition"
            className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>

        <div>
          <label className="block text-gray-700 font-bold mb-2">Message Body</label>
          <textarea 
            required
            rows="6"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Write your message here..."
            className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none"
          ></textarea>
        </div>

        <button 
          type="submit" 
          disabled={loading}
          className={`w-full py-4 rounded-lg text-white font-bold text-lg shadow-md transition transform hover:-translate-y-0.5 ${
            loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700'
          }`}
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
              Sending...
            </span>
          ) : (
            'Send Broadcast Email'
          )}
        </button>

      </form>
    </div>
  );
}