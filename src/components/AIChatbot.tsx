import { useState, useRef, useEffect, useCallback } from 'react';
import { MessageSquare, X, Send, Loader2, Headphones, Clock, Check, User, Mail, Phone, Building2, AlertCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';

type Message = { role: 'user' | 'ai' | 'agent' | 'system'; content: string; sender_name?: string };
type ChatState = 'idle' | 'chatting' | 'collecting_info' | 'connecting' | 'waiting' | 'live_chat';

const AI_RESPONSES: Record<string, string> = {
  shopify: 'For Shopify store issues, I recommend checking your theme compatibility first. Common issues stem from app conflicts or theme version mismatches. Try disabling recently installed apps one by one to isolate the problem. Would you like me to connect you with our Store Development team for a deeper investigation?',
  conversion: 'Conversion optimization starts with your product pages. Focus on high-quality images, clear value propositions, and a frictionless checkout. A/B testing your CTA buttons and reducing form fields can yield quick wins. Our team typically sees 2-3x conversion improvements within weeks.',
  branding: 'A strong brand identity goes beyond a logo. It encompasses your color palette, typography, voice, and visual consistency across all touchpoints. Premium branding can increase perceived value by 40% or more. Would you like to discuss a brand strategy with our team?',
  marketing: 'Effective digital marketing requires a multi-channel approach. We recommend starting with Meta ads for awareness, retargeting for conversion, and email automation for retention. The key is creative quality and audience segmentation. Our campaigns typically achieve 2-4x ROAS.',
  seo: 'SEO is your most sustainable traffic channel. Start with a technical audit, then focus on keyword research, on-page optimization, and content strategy. SEO drives 53% of all website traffic on average. Results typically compound over 3-6 months.',
  product: 'Product research should focus on demand validation, competition analysis, and margin assessment. Use tools like Google Trends, competitor analysis, and market data. We help identify products with 3x or higher profit potential while reducing failure risk by 70%.',
  pricing: 'Pricing depends on the scope of your project. Our services start at $300 for branding and go up to $3,000+ for full ecommerce growth systems. I would recommend connecting you with our team for a custom quote tailored to your specific needs.',
  consultation: 'I can help schedule a free strategy consultation with our team. During this call, we will audit your current presence and provide recommendations. Let me connect you with a specialist who can set that up.',
  default: 'I can help with Shopify issues, conversion optimization, branding, marketing strategy, SEO, product research, and more. Could you tell me more about what you need? If you would like to speak with a live specialist, just click "Request Live Support" below.',
  greeting: 'Hello. I am the SHOPIJAVID AI assistant. I can help you with ecommerce growth, branding, marketing, Shopify, and more. What can I help you with today?',
  handover: 'Your request has been forwarded to our support team. A representative will join shortly. You will also receive updates through your email if you provided one.',
};

const LIVE_SUPPORT_KEYWORDS = ['live support', 'human', 'agent', 'technician', 'expert', 'real person', 'talk to someone', 'speak with', 'representative'];
const PRICING_KEYWORDS = ['price', 'pricing', 'cost', 'how much', 'quote', 'budget'];
const CONSULTATION_KEYWORDS = ['consultation', 'call', 'meeting', 'book', 'schedule', 'appointment'];
const CUSTOM_PROJECT_KEYWORDS = ['custom', 'project', 'specific', 'tailored', 'special'];

function getAIResponse(input: string): { response: string; shouldEscalate: boolean; reason?: string } {
  const lower = input.toLowerCase();
  if (LIVE_SUPPORT_KEYWORDS.some((k) => lower.includes(k))) return { response: AI_RESPONSES.handover, shouldEscalate: true, reason: 'visitor_request' };
  if (PRICING_KEYWORDS.some((k) => lower.includes(k))) return { response: AI_RESPONSES.pricing + ' Would you like me to connect you with a specialist for a custom quote?', shouldEscalate: true, reason: 'pricing' };
  if (CONSULTATION_KEYWORDS.some((k) => lower.includes(k))) return { response: AI_RESPONSES.consultation, shouldEscalate: true, reason: 'consultation' };
  if (CUSTOM_PROJECT_KEYWORDS.some((k) => lower.includes(k))) return { response: 'Custom projects are our specialty. Let me connect you with our team to discuss the details.', shouldEscalate: true, reason: 'custom_project' };
  if (lower.includes('shopify') || lower.includes('store')) return { response: AI_RESPONSES.shopify, shouldEscalate: false };
  if (lower.includes('conversion') || lower.includes('convert')) return { response: AI_RESPONSES.conversion, shouldEscalate: false };
  if (lower.includes('brand')) return { response: AI_RESPONSES.branding, shouldEscalate: false };
  if (lower.includes('marketing') || lower.includes('ad') || lower.includes('campaign')) return { response: AI_RESPONSES.marketing, shouldEscalate: false };
  if (lower.includes('seo') || lower.includes('search') || lower.includes('traffic')) return { response: AI_RESPONSES.seo, shouldEscalate: false };
  if (lower.includes('product') || lower.includes('research')) return { response: AI_RESPONSES.product, shouldEscalate: false };
  return { response: AI_RESPONSES.default, shouldEscalate: false };
}

function generateSessionId(): string {
  return 'SJ-' + Date.now().toString(36).toUpperCase() + '-' + Math.random().toString(36).substring(2, 6).toUpperCase();
}

export default function AIChatbot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const [state, setState] = useState<ChatState>('idle');
  const [sessionId] = useState(() => generateSessionId());
  const [agentJoined, setAgentJoined] = useState(false);
  const [agentTyping, setAgentTyping] = useState(false);

  // Contact info form
  const [contactForm, setContactForm] = useState({ name: '', email: '', phone: '', company: '', subject: '' });
  const [contactSubmitted, setContactSubmitted] = useState(false);
  const [requestSent, setRequestSent] = useState(false);
  const [pageSource] = useState(() => typeof window !== 'undefined' ? window.location.hash.slice(1) || '/' : '/');

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, typing, agentTyping]);

  // Poll for agent messages when in live_chat or waiting state
  useEffect(() => {
    if (state !== 'waiting' && state !== 'live_chat') {
      if (pollRef.current) { clearInterval(pollRef.current); pollRef.current = null; }
      return;
    }

    let lastMsgTime = new Date().toISOString();
    pollRef.current = setInterval(async () => {
      // Check if agent joined
      const { data: session } = await supabase
        .from('sj_live_sessions')
        .select('status, agent_id')
        .eq('session_id', sessionId)
        .maybeSingle();

      if (session?.status === 'agent_joined' && !agentJoined) {
        setAgentJoined(true);
        setState('live_chat');
        setMessages((prev) => [...prev, { role: 'system', content: 'A support agent has joined the conversation. You can now chat directly.' }]);
      }

      if (session?.status === 'resolved' || session?.status === 'closed') {
        if (state !== 'idle') {
          setMessages((prev) => [...prev, { role: 'system', content: 'This conversation has been marked as resolved. Thank you for contacting SHOPIJAVID support.' }]);
          setState('idle');
          if (pollRef.current) { clearInterval(pollRef.current); pollRef.current = null; }
        }
      }

      // Fetch new agent messages
      const { data: newMsgs } = await supabase
        .from('sj_live_messages')
        .select('role, content, sender_name, created_at')
        .eq('session_id', sessionId)
        .eq('role', 'agent')
        .gt('created_at', lastMsgTime)
        .order('created_at', { ascending: true });

      if (newMsgs && newMsgs.length > 0) {
        lastMsgTime = newMsgs[newMsgs.length - 1].created_at;
        setAgentTyping(false);
        setMessages((prev) => [...prev, ...newMsgs.map((m: any) => ({ role: 'agent' as const, content: m.content, sender_name: m.sender_name }))]);
      }
    }, 3000);

    return () => { if (pollRef.current) clearInterval(pollRef.current); };
  }, [state, sessionId, agentJoined]);

  const sendNotification = useCallback(async (type: string, extra?: Record<string, string>) => {
    const apiUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/live-support-notify`;
    try {
      await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}` },
        body: JSON.stringify({
          type, sessionId,
          userName: contactForm.name,
          userEmail: contactForm.email,
          userPhone: contactForm.phone,
          userCompany: contactForm.company,
          subject: contactForm.subject || extra?.subject,
          pageSource,
          conversationSummary: messages.map((m) => `${m.role}: ${m.content}`).join('\n'),
          ...extra,
        }),
      });
    } catch (e) { /* silent fail */ }
  }, [sessionId, contactForm, pageSource, messages]);

  const startChat = () => {
    setState('chatting');
    setMessages([{ role: 'ai', content: AI_RESPONSES.greeting }]);
    supabase.from('sj_live_sessions').insert({ session_id: sessionId, status: 'ai_mode', page_source: pageSource }).then(() => {});
  };

  const sendMessage = async () => {
    if (!input.trim() || typing) return;
    const userMsg = input.trim();
    setMessages((prev) => [...prev, { role: 'user', content: userMsg }]);
    setInput('');
    setTyping(true);

    supabase.from('sj_live_messages').insert({ session_id: sessionId, role: 'user', content: userMsg }).then(() => {});

    // If agent has joined, don't run AI — just notify
    if (agentJoined) {
      sendNotification('visitor_new_message', { subject: userMsg });
      setTyping(false);
      return;
    }

    const { response, shouldEscalate } = getAIResponse(userMsg);

    setTimeout(() => {
      setTyping(false);
      setMessages((prev) => [...prev, { role: 'ai', content: response }]);
      supabase.from('sj_live_messages').insert({ session_id: sessionId, role: 'ai', content: response }).then(() => {});

      if (shouldEscalate) {
        setTimeout(() => initiateLiveSupport(), 1500);
      }
    }, 1500 + Math.random() * 800);
  };

  const initiateLiveSupport = () => {
    setState('collecting_info');
    setMessages((prev) => [...prev, { role: 'system', content: 'To connect you with a live support agent, please provide your contact information so our team can reach you.' }]);
  };

  const submitContactInfo = async () => {
    if (!contactForm.name || !contactForm.email) return;
    setContactSubmitted(true);
    setState('connecting');
    setMessages((prev) => [...prev, { role: 'system', content: AI_RESPONSES.handover }]);

    // Update session with contact info
    await supabase
      .from('sj_live_sessions')
      .update({
        user_name: contactForm.name,
        user_email: contactForm.email,
        user_phone: contactForm.phone,
        user_company: contactForm.company,
        subject: contactForm.subject,
        status: 'waiting',
      })
      .eq('session_id', sessionId);

    // Send notification to admin
    await sendNotification('live_support_request');

    setRequestSent(true);
    setMessages((prev) => [...prev, { role: 'system', content: 'Your request has been sent to our support team. An agent will join shortly. Please wait...' }]);
    setState('waiting');
  };

  const requestLiveSupport = () => {
    initiateLiveSupport();
  };

  return (
    <>
      <button
        onClick={() => { if (!open) { setOpen(true); if (messages.length === 0) startChat(); } }}
        className={`fixed bottom-6 left-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-amber-500 text-carbon-950 shadow-amber transition-all hover:scale-110 ${open ? 'hidden' : 'flex'} animate-pulse-amber`}
      >
        <MessageSquare size={26} />
      </button>

      {open && (
        <div className="fixed bottom-6 left-6 z-50 flex h-[600px] max-h-[85vh] w-[calc(100vw-3rem)] max-w-sm flex-col overflow-hidden rounded-2xl bg-carbon-900 ring-1 ring-white/10 shadow-lift animate-bounce-in">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-white/10 bg-carbon-950 px-4 py-3">
            <div className="flex items-center gap-2.5">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-amber-500 text-carbon-950 font-bold text-sm">S</span>
              <div>
                <p className="text-sm font-semibold text-white">SHOPIJAVID Assistant</p>
                <p className="text-xs text-forest-400 flex items-center gap-1">
                  {agentJoined ? (
                    <><span className="h-1.5 w-1.5 rounded-full bg-forest-400" /> Agent Online</>
                  ) : (
                    <><span className="h-1.5 w-1.5 rounded-full bg-forest-400 animate-pulse" /> AI Online</>
                  )}
                </p>
              </div>
            </div>
            <button onClick={() => setOpen(false)} className="text-carbon-400 hover:text-white transition"><X size={18} /></button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                {msg.role === 'system' ? (
                  <div className="w-full rounded-xl bg-amber-500/10 p-3 text-center text-xs text-amber-400 ring-1 ring-amber-500/20">{msg.content}</div>
                ) : (
                  <div className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm ${msg.role === 'user' ? 'bg-amber-500 text-carbon-950' : msg.role === 'agent' ? 'bg-forest-600 text-white' : 'bg-carbon-800 text-white'}`}>
                    {msg.role === 'agent' && msg.sender_name && <p className="text-xs font-semibold text-forest-200 mb-0.5">{msg.sender_name}</p>}
                    {msg.content}
                  </div>
                )}
              </div>
            ))}

            {typing && (
              <div className="flex justify-start">
                <div className="flex gap-1 rounded-2xl bg-carbon-800 px-4 py-3">
                  <span className="h-2 w-2 rounded-full bg-carbon-400 animate-typing" style={{ animationDelay: '0s' }} />
                  <span className="h-2 w-2 rounded-full bg-carbon-400 animate-typing" style={{ animationDelay: '0.2s' }} />
                  <span className="h-2 w-2 rounded-full bg-carbon-400 animate-typing" style={{ animationDelay: '0.4s' }} />
                </div>
              </div>
            )}

            {agentTyping && (
              <div className="flex justify-start">
                <div className="flex gap-1 rounded-2xl bg-forest-600 px-4 py-3">
                  <span className="h-2 w-2 rounded-full bg-forest-200 animate-typing" style={{ animationDelay: '0s' }} />
                  <span className="h-2 w-2 rounded-full bg-forest-200 animate-typing" style={{ animationDelay: '0.2s' }} />
                  <span className="h-2 w-2 rounded-full bg-forest-200 animate-typing" style={{ animationDelay: '0.4s' }} />
                </div>
              </div>
            )}

            {/* Contact info form */}
            {state === 'collecting_info' && !contactSubmitted && (
              <div className="rounded-xl bg-carbon-800 p-4 ring-1 ring-white/10 space-y-3">
                <p className="text-xs font-semibold uppercase tracking-widest text-amber-500">Contact Information</p>
                <div className="relative">
                  <User size={14} className="absolute left-3 top-3.5 text-carbon-500" />
                  <input value={contactForm.name} onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })} className="input-dark w-full pl-9 text-xs" placeholder="Full name (required)" />
                </div>
                <div className="relative">
                  <Mail size={14} className="absolute left-3 top-3.5 text-carbon-500" />
                  <input type="email" value={contactForm.email} onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })} className="input-dark w-full pl-9 text-xs" placeholder="Email (required)" />
                </div>
                <div className="relative">
                  <Phone size={14} className="absolute left-3 top-3.5 text-carbon-500" />
                  <input value={contactForm.phone} onChange={(e) => setContactForm({ ...contactForm, phone: e.target.value })} className="input-dark w-full pl-9 text-xs" placeholder="Phone (optional)" />
                </div>
                <div className="relative">
                  <Building2 size={14} className="absolute left-3 top-3.5 text-carbon-500" />
                  <input value={contactForm.company} onChange={(e) => setContactForm({ ...contactForm, company: e.target.value })} className="input-dark w-full pl-9 text-xs" placeholder="Company (optional)" />
                </div>
                <input value={contactForm.subject} onChange={(e) => setContactForm({ ...contactForm, subject: e.target.value })} className="input-dark w-full text-xs" placeholder="Subject of your request" />
                <button onClick={submitContactInfo} disabled={!contactForm.name || !contactForm.email} className="btn-amber w-full text-xs disabled:opacity-50">Connect to Live Support</button>
              </div>
            )}

            {/* Waiting state */}
            {state === 'waiting' && (
              <div className="rounded-xl bg-amber-500/10 p-4 ring-1 ring-amber-500/20 text-center">
                <Loader2 size={20} className="mx-auto animate-spin text-amber-500" />
                <p className="mt-2 text-sm text-white">Waiting for an agent to join...</p>
                {requestSent && <p className="mt-1 text-xs text-forest-400 flex items-center justify-center gap-1"><Check size={12} /> Team notified</p>}
                <p className="mt-2 text-xs text-carbon-400">Your request has been sent. An agent will join shortly.</p>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          {(state === 'chatting' || state === 'live_chat') && (
            <div className="border-t border-white/10 bg-carbon-950 px-4 py-3">
              <div className="flex gap-2">
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
                  placeholder={agentJoined ? 'Type your message to the agent...' : 'Type your message...'}
                  className="input-dark flex-1 text-sm"
                />
                <button onClick={sendMessage} disabled={!input.trim() || typing} className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-amber-500 text-carbon-950 hover:bg-amber-400 transition disabled:opacity-50">
                  <Send size={18} />
                </button>
              </div>
              {!agentJoined && state === 'chatting' && (
                <button onClick={requestLiveSupport} className="mt-2 w-full text-xs text-amber-500 hover:text-amber-400 transition flex items-center justify-center gap-1.5">
                  <Headphones size={13} /> Request Live Support
                </button>
              )}
            </div>
          )}
        </div>
      )}
    </>
  );
}
