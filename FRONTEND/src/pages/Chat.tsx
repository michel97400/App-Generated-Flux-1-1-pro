import { useState, useEffect } from 'react';
import { apiGet, apiPost } from '../utils/api';
import { Trash2, MousePointer2 } from 'lucide-react';

interface ChatMessage {
  chatId: string;
  chatMessage: string;
  chatResponse: string;
  chatCreatedAt: string;
}

interface Conversation {
  id: string;
  title: string;
  lastMessage: string;
  createdAt: string;
  messageCount: number;
}

function Chat() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null);
  const [view, setView] = useState<'conversations' | 'chat'>('conversations');
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [isNewConversation, setIsNewConversation] = useState(false);

  const formatResponse = (text: string) => {
    // Remplacer les doubles sauts de ligne par des paragraphes
    const paragraphs = text.split('\n\n').filter(p => p.trim());
    
    return paragraphs.map((paragraph, index) => {
      // Détecter les listes
      const lines = paragraph.split('\n');
      const hasListItems = lines.some(line => line.trim().match(/^[-*]\s/));
      
      if (hasListItems) {
        // Traiter comme une liste
        const listItems = lines.map(line => {
          const match = line.trim().match(/^([-*])\s(.+)$/);
          if (match) {
            return `<li>${match[2]}</li>`;
          }
          return line ? `<li>${line}</li>` : '';
        }).filter(item => item);
        
        return `<ul key=${index}>${listItems.join('')}</ul>`;
      } else {
        // Traiter comme paragraphe normal
        const formattedParagraph = paragraph
          .split('\n')
          .map(line => line.trim())
          .filter(line => line)
          .join('<br>');
        
        return `<p key=${index}>${formattedParagraph}</p>`;
      }
    }).join('');
  };

  useEffect(() => {
    if (view === 'conversations') {
      loadConversations();
    }
  }, [view]);

  const loadConversations = async () => {
    try {
      const response = await apiGet('/chat/conversations');
      if (response.ok) {
        const data = await response.json();
        setConversations(data);
      }
    } catch (error) {
      console.error('Erreur chargement conversations:', error);
    }
  };

  const loadConversation = async (conversationId: string) => {
    try {
      setLoadingHistory(true);
      setIsNewConversation(false);
      const response = await apiGet(`/chat/history?conversationId=${conversationId}`);
      if (response.ok) {
        const data = await response.json();
        setMessages(data);
        setCurrentConversationId(conversationId);
        setView('chat');
      }
    } catch (error) {
      console.error('Erreur chargement conversation:', error);
    } finally {
      setLoadingHistory(false);
    }
  };

  const startNewConversation = () => {
    const newConversationId = `conv_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    setMessages([]);
    setCurrentConversationId(newConversationId);
    setIsNewConversation(true);
    setLoadingHistory(false);
    setView('chat');
  };

  const backToConversations = () => {
    setView('conversations');
    setMessages([]);
    setCurrentConversationId(null);
    setIsNewConversation(false);
  };

  useEffect(() => {
    // Scroll to bottom when messages change
    const chatMessages = document.querySelector('.chat-messages');
    if (chatMessages) {
      chatMessages.scrollTop = chatMessages.scrollHeight;
    }
  }, [messages]);

  const sendMessage = async () => {
    if (!newMessage.trim() || !currentConversationId) return;

    setLoading(true);
    try {
      const response = await apiPost('/chat/message', { 
        message: newMessage,
        conversationId: currentConversationId 
      });
      if (response.ok) {
        const data = await response.json();
        const newChat: ChatMessage = {
          chatId: Date.now().toString(), // Temporary ID
          chatMessage: newMessage,
          chatResponse: data.response,
          chatCreatedAt: new Date().toISOString(),
        };
        setMessages(prev => [...prev, newChat]);
        setNewMessage('');
        // Recharger les conversations pour mettre à jour la liste
        loadConversations();
      }
    } catch (error) {
      console.error('Erreur envoi message:', error);
    } finally {
      setLoading(false);
    }
  };

  const deleteConversation = async (conversationId: string, event: React.MouseEvent) => {
    event.stopPropagation(); // Empêcher le clic de déclencher loadConversation
    
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette conversation ?')) {
      return;
    }

    try {
      const response = await fetch(`/api/chat/conversation/${conversationId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
      });
      
      if (response.ok) {
        // Recharger la liste des conversations
        loadConversations();
        // Si on était dans cette conversation, revenir à la liste
        if (currentConversationId === conversationId) {
          setView('conversations');
          setMessages([]);
          setCurrentConversationId(null);
          setIsNewConversation(false);
        }
      } else {
        alert('Erreur lors de la suppression de la conversation');
      }
    } catch (error) {
      console.error('Erreur suppression conversation:', error);
      alert('Erreur lors de la suppression de la conversation');
    }
  };

  const generateConversationTitle = (messages: ChatMessage[]): string => {
    if (messages.length === 0) return 'Nouvelle conversation';
    
    const firstMessage = messages[0].chatMessage;
    // Prendre les premiers mots (max 6 mots) et limiter à 30 caractères
    const words = firstMessage.split(' ').slice(10, 20);
    let title = words.join(' ');
    
    if (title.length > 100) {
      title = title.substring(0, 90) + '...';
    }
    
    return title || 'Conversation';
  };

  const groupConversationsByDate = (conversations: Conversation[]) => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekAgo = new Date(today);
    weekAgo.setDate(weekAgo.getDate() - 7);

    const groups: { [key: string]: Conversation[] } = {
      'Aujourd\'hui': [],
      'Cette semaine': [],
      'Plus ancien': []
    };

    conversations.forEach(conv => {
      const convDate = new Date(conv.createdAt);
      const convDateOnly = new Date(convDate.getFullYear(), convDate.getMonth(), convDate.getDate());

      if (convDateOnly.getTime() === today.getTime()) {
        groups['Aujourd\'hui'].push(conv);
      } else if (convDateOnly >= weekAgo) {
        groups['Cette semaine'].push(conv);
      } else {
        groups['Plus ancien'].push(conv);
      }
    });

    // Trier les conversations dans chaque groupe par date décroissante
    Object.keys(groups).forEach(key => {
      groups[key].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    });

    return groups;
  };

  const currentTitle = messages.length > 0 ? generateConversationTitle(messages) : 'Nouvelle conversation';

  const groupedConversations = groupConversationsByDate(conversations);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <>
      {view === 'conversations' ? (
        <div className="conversations-container">
          <div className="conversations-header">
            <h2>Historiques de chat</h2>
            <button onClick={startNewConversation} className="new-conversation-btn">
              Nouvelle Conversation
            </button>
          </div>
          <div className="conversations-list">
            {conversations.length === 0 ? (
              <p className="no-conversations">Aucune conversation trouvée. Commencez une nouvelle conversation !</p>
            ) : (
              Object.entries(groupedConversations).map(([period, convs]) => (
                <div key={period} className="conversation-section">
                  <h3 className="section-title">{period}</h3>
                  <div className="section-conversations">
                    {convs.length === 0 ? (
                      <p className="empty-section">Aucune conversation {period.toLowerCase()}</p>
                    ) : (
                      convs.map((conv) => (
                        <div key={conv.id} className="conversation-item" onClick={() => loadConversation(conv.id)}>
                          <div className="conversation-header">
                            <div className="conversation-title">{conv.title}</div>
                            <button 
                              className="delete-conversation-btn"
                              onClick={(e) => deleteConversation(conv.id, e)}
                              title="Supprimer la conversation"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                          <div className="conversation-preview">{conv.lastMessage.substring(0, 100)}...</div>
                          <div className="conversation-meta">
                            {conv.messageCount} messages • {new Date(conv.createdAt).toLocaleDateString('fr-FR')}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      ) : (
        <div className="chat-container">
          <div className="chat-header">
            <button onClick={backToConversations} className="back-btn">
              ← Retour aux conversations
            </button>
            <div className="conversation-title-small">
              {currentTitle}
            </div>
          </div>
          <div className="chat-messages">
            {loadingHistory && !isNewConversation ? (
              <p>Chargement de la conversation...</p>
            ) : messages.length === 0 ? (
              <p>Aucun message dans cette conversation. Envoyez le premier message !</p>
            ) : (
              messages.map((msg) => (
                <div key={msg.chatId} className="message-pair">
                  <div className="user-message-bubble">
                    <div className="message-content">{msg.chatMessage}</div>
                    <div className="message-date">
                      {new Date(msg.chatCreatedAt).toLocaleString()}
                    </div>
                  </div>
                  <div className="ai-message-bubble">
                    <div className="message-content" dangerouslySetInnerHTML={{ __html: formatResponse(msg.chatResponse) }} />
                    <div className="message-date">
                      {new Date(msg.chatCreatedAt).toLocaleString()}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
          <div className="chat-input">
            <div className="chat-input-header">

            </div>
            <div className="input-row">
              <textarea
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Tapez votre message..."
                rows={3}
                disabled={loading}
              />
              <button onClick={sendMessage} disabled={loading || !newMessage.trim()}>
                  <MousePointer2 />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Chat;