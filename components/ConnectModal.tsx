import React, { useState } from 'react';
import Modal from './ui/Modal';
import { Input, Textarea } from './ui/Input';
import Button from './ui/Button';

interface ConnectModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const ConnectModal: React.FC<ConnectModalProps> = ({ isOpen, onClose }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [isSending, setIsSending] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSending(true);
        // Simulate sending a message
        setTimeout(() => {
            setIsSending(false);
            alert('Thank you for your message! We will get back to you soon.');
            onClose();
            // Reset form
            setName('');
            setEmail('');
            setMessage('');
        }, 1000);
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Connect With Us">
            <form onSubmit={handleSubmit} className="space-y-4">
                <p className="text-sm text-text-secondary">Have a question or want to discuss a custom plan? Drop us a line!</p>
                <Input
                    label="Full Name"
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    placeholder="Your Name"
                />
                <Input
                    label="Email Address"
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="you@example.com"
                />
                <Textarea
                    label="Message"
                    id="message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    required
                    placeholder="How can we help you?"
                    rows={5}
                />
                <Button type="submit" isLoading={isSending} className="w-full !py-3">
                    Send Message
                </Button>
            </form>
        </Modal>
    );
};

export default ConnectModal;