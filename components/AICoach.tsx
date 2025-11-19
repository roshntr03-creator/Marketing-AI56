import React, { useState, useRef, useEffect } from 'react';
import { PaperAirplaneIcon, UserCircleIcon, SparklesIcon } from '@heroicons/react/24/solid';
import Modal from './ui/Modal';
import { Input } from './ui/Input';
import Button from './ui/Button';
import { CoachMessage } from '../types';
import aiService from '../services/aiService';

interface AICoachProps {
  isOpen: boolean;
  onClose: () => void;
}

const AICoach: React.FC<AICoachProps> = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState<CoachMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSend = async () => {
    if (input.trim() === '' || isLoading) return;

    const userMessage: CoachMessage = { id: Date.now().toString(), sender: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    const coachResponse = await aiService.coachReply(input);
    setMessages(prev => [...prev, coachResponse]);
    setIsLoading(false);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="AI Marketing Coach">
      <div className="flex flex-col h-[70vh]">
        <div className="flex-grow overflow-y-auto pr-2 space-y-4">
          {messages.map(msg => (
            <div key={msg.id} className={`flex items-start gap-3 ${msg.sender === 'user' ? 'justify-end' : ''}`}>
              {msg.sender === 'coach' && (
                <div className="bg-primary p-2 rounded-full">
                    <SparklesIcon className="w-5 h-5 text-white" />
                </div>
              )}
              <div className={`max-w-xs md:max-w-md p-3 rounded-2xl ${msg.sender === 'user' ? 'bg-primary text-white rounded-br-none' : 'bg-background-dark text-text-primary rounded-bl-none'}`}>
                <p className="text-sm">{msg.text}</p>
              </div>
               {msg.sender === 'user' && (
                <div className="text-text-secondary">
                    <UserCircleIcon className="w-9 h-9" />
                </div>
              )}
            </div>
          ))}
           <div ref={messagesEndRef} />
        </div>
        <div className="mt-4 flex items-center gap-2">
          <Input 
            value={input} 
            onChange={e => setInput(e.target.value)} 
            placeholder="Ask a marketing question..."
            onKeyDown={e => e.key === 'Enter' && handleSend()}
            disabled={isLoading}
          />
          <Button onClick={handleSend} isLoading={isLoading} disabled={!input.trim()}>
            <PaperAirplaneIcon className="w-5 h-5"/>
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default AICoach;