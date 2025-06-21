import { useState } from 'react';
import { Container, Paper, Box, TextField, IconButton, Typography, List, ListItem, ListItemText, Divider } from '@mui/material';
import { Send as SendIcon } from '@mui/icons-material';
import axios from 'axios';
import './App.css';

interface Message {
  question: string;
  response?: {
    query: any;
    data: any[];
    insights: string;
  };
}

function App() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;

    const question = input;
    setInput('');
    setLoading(true);

    const newMessage: Message = { question };
    setMessages(prev => [...prev, newMessage]);

    try {
      const response = await axios.post('http://localhost:3001/api/analyze', { question });
      setMessages(prev => prev.map(msg =>
        msg.question === question ? { ...msg, response: response.data } : msg
      ));
    } catch (error) {
      console.error('Error:', error);
      setMessages(prev => prev.map(msg =>
        msg.question === question ? { ...msg, response: { insights: 'Error processing request' } } : msg
      ));
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSend();
    }
  };

  return (
    <Container maxWidth="md" sx={{ height: '100vh', py: 4 }}>
      <Paper elevation={3} sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        <Typography variant="h5" sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
          eCommerce Data Assistant
        </Typography>
        
        <Box sx={{ flexGrow: 1, overflowY: 'auto', p: 2 }}>
          <List>
            {messages.map((msg, index) => (
              <ListItem key={index} sx={{ flexDirection: 'column', alignItems: 'flex-start', gap: 1 }}>
                <ListItemText 
                  primary={msg.question}
                  sx={{ 
                    '& .MuiListItemText-primary': { 
                      color: 'primary.main',
                      fontWeight: 'medium'
                    }
                  }}
                />
                {msg.response && (
                  <ListItemText
                    primary={msg.response.insights}
                    secondary={
                      <Box sx={{ mt: 1 }}>
                        <Typography variant="caption" color="text.secondary">
                          Data sample: {JSON.stringify(msg.response.data.slice(0, 2))}
                        </Typography>
                      </Box>
                    }
                  />
                )}
                <Divider flexItem sx={{ my: 2 }} />
              </ListItem>
            ))}
          </List>
        </Box>

        <Box sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Ask about your eCommerce data..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={loading}
              multiline
              maxRows={4}
            />
            <IconButton 
              color="primary" 
              onClick={handleSend} 
              disabled={!input.trim() || loading}
              sx={{ alignSelf: 'flex-end' }}
            >
              <SendIcon />
            </IconButton>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
}

export default App;
