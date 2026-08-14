import { useState, useEffect, useRef, useCallback } from 'react';
import { Send, LogOut, Search, Clock, CheckCircle, AlertCircle, MessageSquare, Headphones, X, RefreshCw, Mail, Phone, Building2, Globe, Tag, ArrowLeft } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useHashRoute } from '../lib/router';

type Session = {
  id: string;
  session_id: string;
  user_name: string | null;
  user_email: string | null;
  user_phone: string | null;
  user_company: string | null;
  subject: string | null;
  status: string;
  ticket_number: string | null;
  priority: string | null;
  page_source: string | null;
  created_at: string;
  updated_at: string;
};

type ChatMessage = {
  id: string;
  session_id: string;
  role: string;
  content: string;
  sender_name: string | null;
  created_at: string;
};

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  ai_mode: { label: 'AI Mode', color: 'text-carbon-400', bg: 'bg-carbon-800' },
  waiting: { label: 'Waiting for Agent', color: 'text-amber-500', bg: 'bg-amber-500/15' },
  agent_joined: { label: 'Agent Joined', color: 'text-forest-400', bg: 'bg-forest-500/15' },
  in_progress: { label: 'In Progress', color: 'text-blue-400', bg: 'bg-blue-500/15' },
  resolved: { label: 'Resolved', color: 'text-forest-400', bg: 'bg-forest-500/15' },
  closed: { label: 'Closed', color: 'text-carbon-500', bg: 'bg-carbon-800' },
  waiting_callback: { label: 'Callback Requested', color: 'text-orange-400', bg: 'bg-orange-500/15' },
};

export default function AdminPage() {
  const { route, navigate } = useHashRoute();
  const [authed, setAuthed] = useState(() => sessionStorage.getItem('sj_admin_authed') === 'true');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);

  const [sessions, setSessions] = useState<Session[]>([]);
  const [selectedSession, setSelectedSession] = useState<Session | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [agentInput, setAgentInput] = useState('');
  const [filter, setFilter] = useState<'all' | 'waiting' | 'active' | 'closed'>('all');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({ waiting: 0, active: 0, closed: 0, missed: 0 });
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Parse session ID from URL
  useEffect(() => {
    if (!authed) return;
    const params = new URLSearchParams(route.split('?')[1] || '');
    const sessionParam = params.get('session');
    if (sessionParam) {
      // Find and select this session
      handleSelectSession(sessionParam);
    }
  }, [authed, route, handleSelectSession]);

  const handleLogin = async () => {
    setLoginLoading(true);
    setLoginError('');
    try {
      const { data, error } = await supabase
        .from('sj_admin_users')
        .select('email, password_hash')
        .eq('email', email)
        .maybeSingle();

      if (error || !data) {
        setLoginError('Invalid credentials');
        return;
      }

      // Verify password using crypt
      const { data: valid, error: verifyErr } = await supabase.rpc('verify_password', {
        input_password: password,
        input_hash: data.password_hash,
      });

      if (verifyErr || !valid) {
        setLoginError('Invalid credentials');
        return;
      }

      sessionStorage.setItem('sj_admin_authed', 'true');
      setAuthed(true);
    } catch {
      setLoginError('Login failed');
    } finally {
      setLoginLoading(false);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('sj_admin_authed');
    setAuthed(false);
    navigate('/');
  };

  const fetchSessions = useCallback(async () => {
    setLoading(true);
    const query = supabase.from('sj_live_sessions').select('*').order('updated_at', { ascending: false });
    const { data, error } = await query;
    if (!error && data) {
      setSessions(data as Session[]);
      const waiting = data.filter((s) => s.status === 'waiting' || s.status === 'waiting_callback').length;
      const active = data.filter((s) => s.status === 'agent_joined' || s.status === 'in_progress').length;
      const closed = data.filter((s) => s.status === 'resolved' || s.status === 'closed').length;
      const missed = data.filter((s) => s.status === 'waiting' && new Date(s.updated_at).getTime() < Date.now() - 30 * 60 * 1000).length;
      setStats({ waiting, active, closed, missed });
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (authed) fetchSessions();
  }, [authed, fetchSessions]);

  // Poll for new sessions and messages
  useEffect(() => {
    if (!authed) return;
    pollRef.current = setInterval(() => {
      fetchSessions();
      if (selectedSession) fetchMessages(selectedSession.session_id);
    }, 5000);
    return () => { if (pollRef.current) clearInterval(pollRef.current); };
  }, [authed, selectedSession, fetchSessions]);

  const fetchMessages = async (sid: string) => {
    const { data } = await supabase
      .from('sj_live_messages')
      .select('*')
      .eq('session_id', sid)
      .order('created_at', { ascending: true });
    if (data) setMessages(data as ChatMessage[]);
  };

  const handleSelectSession = async (sid: string) => {
    const session = sessions.find((s) => s.session_id === sid) || await fetchSessionById(sid);
    if (session) {
      setSelectedSession(session);
      fetchMessages(sid);
      if (session.status === 'waiting' || session.status === 'waiting_callback') {
        joinConversation(sid);
      }
    }
  };

  const fetchSessionById = async (sid: string): Promise<Session | null> => {
    const { data } = await supabase.from('sj_live_sessions').select('*').eq('session_id', sid).maybeSingle();
    return data as Session | null;
  };

  const joinConversation = async (sid: string) => {
    await supabase.from('sj_live_sessions').update({ status: 'agent_joined', agent_id: 'admin' }).eq('session_id', sid);
    await supabase.from('sj_live_messages').insert({ session_id: sid, role: 'system', content: 'A support agent has joined the conversation.' });
    fetchSessions();
    fetchMessages(sid);
  };

  const sendAgentMessage = async () => {
    if (!agentInput.trim() || !selectedSession) return;
    const msg = agentInput.trim();
    setAgentInput('');
    await supabase.from('sj_live_messages').insert({
      session_id: selectedSession.session_id,
      role: 'agent',
      content: msg,
      sender_name: 'SHOPIJAVID Support',
    });
    if (selectedSession.status === 'agent_joined') {
      await supabase.from('sj_live_sessions').update({ status: 'in_progress' }).eq('session_id', selectedSession.session_id);
    }
    fetchMessages(selectedSession.session_id);
    fetchSessions();
  };

  const updateStatus = async (status: string) => {
    if (!selectedSession) return;
    await supabase.from('sj_live_sessions').update({ status }).eq('session_id', selectedSession.session_id);
    setSelectedSession({ ...selectedSession, status });
    fetchSessions();
  };

  const filteredSessions = sessions.filter((s) => {
    const matchesSearch = !search || (s.user_name?.toLowerCase().includes(search.toLowerCase()) || s.user_email?.toLowerCase().includes(search.toLowerCase()) || s.ticket_number?.toLowerCase().includes(search.toLowerCase()));
    const matchesFilter = filter === 'all' ||
      (filter === 'waiting' && (s.status === 'waiting' || s.status === 'waiting_callback')) ||
      (filter === 'active' && (s.status === 'agent_joined' || s.status === 'in_progress')) ||
      (filter === 'closed' && (s.status === 'resolved' || s.status === 'closed'));
    return matchesSearch && matchesFilter;
  });

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (!authed) {
    return (
      <div className="min-h-screen bg-carbon-950 flex items-center justify-center px-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <img src="/images/shopi.jpeg" alt="" className="h-16 w-16 rounded-full mx-auto ring-2 ring-white/20" />
            <h1 className="mt-4 font-serif text-2xl font-semibold text-white tracking-widest">SHOPIJAVID</h1>
            <p className="text-sm text-amber-500 tracking-widest">ADMIN DASHBOARD</p>
          </div>
          <div className="card-dark p-8">
            <h2 className="text-lg font-semibold text-white mb-6">Secure Login</h2>
            {loginError && <div className="mb-4 rounded-lg bg-red-500/10 p-3 text-sm text-red-400 ring-1 ring-red-500/20 flex items-center gap-2"><AlertCircle size={16} /> {loginError}</div>}
            <div className="space-y-4">
              <div>
                <label className="text-xs font-medium text-carbon-400 mb-1.5 block">Email</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="input-dark w-full" placeholder="admin@shopijavid.com" onKeyDown={(e) => { if (e.key === 'Enter') handleLogin(); }} />
              </div>
              <div>
                <label className="text-xs font-medium text-carbon-400 mb-1.5 block">Password</label>
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="input-dark w-full" placeholder="••••••••" onKeyDown={(e) => { if (e.key === 'Enter') handleLogin(); }} />
              </div>
              <button onClick={handleLogin} disabled={loginLoading} className="btn-amber w-full disabled:opacity-50">
                {loginLoading ? <RefreshCw size={16} className="animate-spin mx-auto" /> : 'Sign In'}
              </button>
            </div>
          </div>
          <button onClick={() => navigate('/')} className="mt-4 w-full text-center text-sm text-carbon-500 hover:text-white transition flex items-center justify-center gap-1.5">
            <ArrowLeft size={14} /> Back to website
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-carbon-950">
      {/* Top bar */}
      <div className="border-b border-white/10 bg-carbon-900 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img src="/images/shopi.jpeg" alt="" className="h-9 w-9 rounded-full ring-1 ring-white/20" />
          <div>
            <p className="font-serif text-sm font-semibold text-white tracking-widest">SHOPIJAVID</p>
            <p className="text-xs text-amber-500">Support Dashboard</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={fetchSessions} className="text-carbon-400 hover:text-white transition" title="Refresh"><RefreshCw size={16} className={loading ? 'animate-spin' : ''} /></button>
          <button onClick={handleLogout} className="flex items-center gap-1.5 text-sm text-carbon-400 hover:text-red-400 transition"><LogOut size={15} /> Logout</button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 p-4">
        {[
          { label: 'Waiting', value: stats.waiting, icon: Clock, color: 'text-amber-500', bg: 'bg-amber-500/10' },
          { label: 'Active', value: stats.active, icon: Headphones, color: 'text-forest-400', bg: 'bg-forest-500/10' },
          { label: 'Closed', value: stats.closed, icon: CheckCircle, color: 'text-carbon-400', bg: 'bg-carbon-800' },
          { label: 'Missed', value: stats.missed, icon: AlertCircle, color: 'text-red-400', bg: 'bg-red-500/10' },
        ].map((s) => (
          <div key={s.label} className={`rounded-xl p-4 ${s.bg} ring-1 ring-white/5`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-serif font-semibold text-white">{s.value}</p>
                <p className="text-xs text-carbon-400 mt-0.5">{s.label}</p>
              </div>
              <s.icon size={20} className={s.color} />
            </div>
          </div>
        ))}
      </div>

      {/* Main layout */}
      <div className="flex flex-col lg:flex-row gap-4 px-4 pb-4" style={{ height: 'calc(100vh - 200px)' }}>
        {/* Session list */}
        <div className={`w-full lg:w-96 shrink-0 flex flex-col rounded-xl bg-carbon-900 ring-1 ring-white/10 overflow-hidden ${selectedSession ? 'hidden lg:flex' : 'flex'}`}>
          <div className="p-3 border-b border-white/10 space-y-2">
            <div className="relative">
              <Search size={14} className="absolute left-3 top-3 text-carbon-500" />
              <input value={search} onChange={(e) => setSearch(e.target.value)} className="input-dark w-full pl-9 text-sm" placeholder="Search by name, email, ticket..." />
            </div>
            <div className="flex gap-1">
              {(['all', 'waiting', 'active', 'closed'] as const).map((f) => (
                <button key={f} onClick={() => setFilter(f)} className={`flex-1 rounded-lg px-2 py-1.5 text-xs font-medium capitalize transition ${filter === f ? 'bg-amber-500 text-carbon-950' : 'bg-carbon-800 text-carbon-400 hover:text-white'}`}>{f}</button>
              ))}
            </div>
          </div>
          <div className="flex-1 overflow-y-auto">
            {filteredSessions.length === 0 ? (
              <div className="p-8 text-center text-sm text-carbon-500">
                <MessageSquare size={24} className="mx-auto mb-2 opacity-50" />
                No conversations
              </div>
            ) : (
              filteredSessions.map((s) => {
                const sc = STATUS_CONFIG[s.status] || STATUS_CONFIG.ai_mode;
                return (
                  <button key={s.session_id} onClick={() => handleSelectSession(s.session_id)} className={`w-full text-left p-3 border-b border-white/5 transition hover:bg-carbon-800 ${selectedSession?.session_id === s.session_id ? 'bg-carbon-800' : ''}`}>
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-white truncate">{s.user_name || 'Anonymous Visitor'}</p>
                        <p className="text-xs text-carbon-500 truncate">{s.user_email || s.session_id.slice(0, 16)}</p>
                      </div>
                      <span className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium ${sc.bg} ${sc.color}`}>{sc.label}</span>
                    </div>
                    <div className="mt-1.5 flex items-center gap-2 text-[10px] text-carbon-600">
                      {s.ticket_number && <span className="font-mono">{s.ticket_number}</span>}
                      <span>{new Date(s.created_at).toLocaleDateString()}</span>
                      <span>{new Date(s.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Chat panel */}
        {selectedSession ? (
          <div className="flex-1 flex flex-col rounded-xl bg-carbon-900 ring-1 ring-white/10 overflow-hidden">
            {/* Chat header */}
            <div className="p-3 border-b border-white/10 flex items-center justify-between">
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-semibold text-white truncate">{selectedSession.user_name || 'Anonymous Visitor'}</p>
                  {selectedSession.ticket_number && <span className="font-mono text-[10px] text-carbon-500">{selectedSession.ticket_number}</span>}
                </div>
                <p className="text-xs text-carbon-500 truncate">{selectedSession.user_email || 'No email provided'}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className={`rounded-full px-2.5 py-1 text-[10px] font-medium ${(STATUS_CONFIG[selectedSession.status] || STATUS_CONFIG.ai_mode).bg} ${(STATUS_CONFIG[selectedSession.status] || STATUS_CONFIG.ai_mode).color}`}>
                  {(STATUS_CONFIG[selectedSession.status] || STATUS_CONFIG.ai_mode).label}
                </span>
                <button onClick={() => setSelectedSession(null)} className="lg:hidden text-carbon-400 hover:text-white"><X size={18} /></button>
              </div>
            </div>

            {/* Visitor info bar */}
            {(selectedSession.user_email || selectedSession.user_phone || selectedSession.user_company || selectedSession.subject || selectedSession.page_source) && (
              <div className="px-3 py-2 bg-carbon-950 border-b border-white/5 flex flex-wrap gap-3 text-xs">
                {selectedSession.user_email && <span className="flex items-center gap-1 text-carbon-400"><Mail size={11} /> {selectedSession.user_email}</span>}
                {selectedSession.user_phone && <span className="flex items-center gap-1 text-carbon-400"><Phone size={11} /> {selectedSession.user_phone}</span>}
                {selectedSession.user_company && <span className="flex items-center gap-1 text-carbon-400"><Building2 size={11} /> {selectedSession.user_company}</span>}
                {selectedSession.subject && <span className="flex items-center gap-1 text-carbon-400"><Tag size={11} /> {selectedSession.subject}</span>}
                {selectedSession.page_source && <span className="flex items-center gap-1 text-carbon-400"><Globe size={11} /> {selectedSession.page_source}</span>}
              </div>
            )}

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.length === 0 ? (
                <div className="text-center text-sm text-carbon-500 py-8">No messages yet</div>
              ) : (
                messages.map((msg) => (
                  <div key={msg.id} className={`flex ${msg.role === 'agent' ? 'justify-end' : msg.role === 'system' ? 'justify-center' : 'justify-start'}`}>
                    {msg.role === 'system' ? (
                      <div className="rounded-lg bg-amber-500/10 px-3 py-1.5 text-xs text-amber-400 ring-1 ring-amber-500/20">{msg.content}</div>
                    ) : (
                      <div className={`max-w-[75%] rounded-2xl px-4 py-2.5 text-sm ${msg.role === 'agent' ? 'bg-forest-600 text-white' : msg.role === 'ai' ? 'bg-carbon-800 text-white' : 'bg-amber-500 text-carbon-950'}`}>
                        {msg.role === 'agent' && msg.sender_name && <p className="text-[10px] font-semibold text-forest-200 mb-0.5">{msg.sender_name}</p>}
                        {msg.role === 'ai' && <p className="text-[10px] font-semibold text-amber-400 mb-0.5">AI Assistant</p>}
                        {msg.content}
                      </div>
                    )}
                  </div>
                ))
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Action bar */}
            <div className="px-3 py-2 border-t border-white/10 flex flex-wrap gap-2">
              {(selectedSession.status === 'agent_joined' || selectedSession.status === 'in_progress') && (
                <>
                  <button onClick={() => updateStatus('resolved')} className="text-xs rounded-lg bg-forest-500/15 text-forest-400 px-3 py-1.5 hover:bg-forest-500/25 transition flex items-center gap-1"><CheckCircle size={12} /> Resolve</button>
                  <button onClick={() => updateStatus('closed')} className="text-xs rounded-lg bg-carbon-800 text-carbon-400 px-3 py-1.5 hover:bg-carbon-700 transition flex items-center gap-1"><X size={12} /> Close</button>
                </>
              )}
              {(selectedSession.status === 'resolved' || selectedSession.status === 'closed') && (
                <button onClick={() => updateStatus('in_progress')} className="text-xs rounded-lg bg-amber-500/15 text-amber-500 px-3 py-1.5 hover:bg-amber-500/25 transition flex items-center gap-1"><RefreshCw size={12} /> Reopen</button>
              )}
              {(selectedSession.status === 'waiting' || selectedSession.status === 'waiting_callback') && (
                <button onClick={() => joinConversation(selectedSession.session_id)} className="text-xs rounded-lg bg-forest-500/15 text-forest-400 px-3 py-1.5 hover:bg-forest-500/25 transition flex items-center gap-1"><Headphones size={12} /> Join Conversation</button>
              )}
            </div>

            {/* Input */}
            <div className="p-3 border-t border-white/10">
              <div className="flex gap-2">
                <input
                  value={agentInput}
                  onChange={(e) => setAgentInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendAgentMessage(); } }}
                  placeholder="Type your reply..."
                  className="input-dark flex-1 text-sm"
                  disabled={selectedSession.status === 'closed'}
                />
                <button onClick={sendAgentMessage} disabled={!agentInput.trim() || selectedSession.status === 'closed'} className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-amber-500 text-carbon-950 hover:bg-amber-400 transition disabled:opacity-50">
                  <Send size={18} />
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="hidden lg:flex flex-1 items-center justify-center rounded-xl bg-carbon-900 ring-1 ring-white/10">
            <div className="text-center">
              <MessageSquare size={32} className="mx-auto text-carbon-700 mb-3" />
              <p className="text-sm text-carbon-500">Select a conversation to view messages</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
