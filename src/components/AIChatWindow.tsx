import { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { getApiUrl } from '@/utils/api';
import styles from './AIChatWindow.module.css';
import LoadingSpinner from './LoadingSpinner';

interface Message {
    id: number;
    text: string;
    sender: 'user' | 'ai';
}

export default function AIChatWindow({ resourceId }: { resourceId: string }) {
    const [messages, setMessages] = useState<Message[]>([
        { id: 1, text: "Hi! I'm your AI Study Buddy. Ask me anything about this document!", sender: 'ai' }
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(scrollToBottom, [messages]);

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim()) return;

        const userMsg: Message = { id: Date.now(), text: input, sender: 'user' };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setLoading(true);

        try {
            const res = await axios.post(`${getApiUrl()}/ai/chat`, {
                resourceId,
                message: userMsg.text
            });

            const aiMsg: Message = {
                id: Date.now() + 1,
                text: res.data.reply,
                sender: 'ai'
            };
            setMessages(prev => [...prev, aiMsg]);
        } catch (err: any) {
            const errorMessage = err.response?.data?.reply || "Sorry, I'm having trouble connecting right now.";
            const errorMsg: Message = {
                id: Date.now() + 1,
                text: errorMessage,
                sender: 'ai'
            };
            setMessages(prev => [...prev, errorMsg]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.messages}>
                {messages.map(msg => (
                    <div key={msg.id} className={`${styles.message} ${styles[msg.sender]}`}>
                        {msg.text}
                    </div>
                ))}
                {loading && (
                    <div className={`${styles.message} ${styles.ai}`}>
                        <div className={styles.typing}><span>.</span><span>.</span><span>.</span></div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>
            <form onSubmit={handleSend} className={styles.inputArea}>
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Ask a question..."
                    disabled={loading}
                />
                <button type="submit" disabled={loading || !input.trim()}>Send</button>
            </form>
        </div>
    );
}
