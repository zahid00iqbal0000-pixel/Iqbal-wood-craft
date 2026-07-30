import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { askAiFurnitureAdvisor } from '../services/geminiService';
import { Product, AiChatMessage, CustomOrderRequest, WoodType } from '../types';
import { 
  Sparkles, 
  X, 
  Send, 
  Bot, 
  MessageSquare, 
  PhoneCall, 
  Mic, 
  MicOff, 
  User, 
  ShoppingBag, 
  Eye, 
  CheckCircle, 
  AlertCircle, 
  ShieldCheck, 
  Wrench, 
  CreditCard, 
  Truck, 
  ChevronRight,
  ChevronDown
} from 'lucide-react';

export const AiConsultantDrawer: React.FC = () => {
  const { 
    isAiConsultantOpen, 
    setIsAiConsultantOpen, 
    contactInfo, 
    products, 
    addToCart, 
    setSelectedProductId, 
    setCurrentScreen, 
    submitCustomOrder, 
    showToast,
    addAiConversationLog
  } = useApp();

  const [inputPrompt, setInputPrompt] = useState('');
  const [messages, setMessages] = useState<AiChatMessage[]>([
    {
      id: 'm-init',
      sender: 'ai',
      text: 'Assalam-o-Alaikum! Welcome to IQBAL WOODCRAFT AI Consultant, powered by Gemini AI.\n\nI am your 24/7 sales & furniture consultant. How may I assist you today?\n• Recommend furniture by budget or room size\n• Compare products & explain Sheesham wood\n• Room layout & custom furniture AI quotes\n• Pan-Pakistan delivery & company policies',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      quickReplies: [
        '🛋️ Recommend Sofa Sets',
        '🛏️ Recommend Bedroom Suites',
        '💵 Recommend by Budget',
        '📐 Suggest Room Layout',
        '🪵 Explain Sheesham Wood',
        '✨ Custom Furniture AI Quote',
        '🚚 Delivery & Policy'
      ]
    }
  ]);

  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [showHumanContacts, setShowHumanContacts] = useState(false);
  const [isCustomWizardActive, setIsCustomWizardActive] = useState(false);

  // Custom Order Wizard State
  const [wizType, setWizType] = useState('Royal King Bedroom Suite');
  const [wizWood, setWizWood] = useState<WoodType>('Solid Sheesham (Chinioti Rosewood)');
  const [wizDimensions, setWizDimensions] = useState('Standard Size');
  const [wizStain, setWizStain] = useState('Walnut High Gloss');
  const [wizBudget, setWizBudget] = useState(250000);
  const [wizName, setWizName] = useState('');
  const [wizPhone, setWizPhone] = useState('');
  const [wizNotes, setWizNotes] = useState('');

  const chatEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isLoading, isCustomWizardActive]);

  // Log conversation updates for Admin Panel
  useEffect(() => {
    if (messages.length > 1) {
      addAiConversationLog({
        id: 'conv-active-session',
        customerName: wizName || 'Active Customer',
        phone: wizPhone || 'Not provided',
        lastActive: new Date().toISOString(),
        messages: messages,
        status: isCustomWizardActive ? 'Custom Request Submitted' : 'Active'
      });
    }
  }, [messages, isCustomWizardActive, wizName, wizPhone]);

  if (!isAiConsultantOpen) return null;

  // Voice Input Speech Recognition Handler
  const handleVoiceInput = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      showToast('Voice input is not supported on this browser. Please type your query.');
      return;
    }

    if (isListening) {
      setIsListening(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = 'en-US'; // Supports English & Roman Urdu
      recognition.interimResults = false;

      recognition.onstart = () => {
        setIsListening(true);
        showToast('Listening... Speak your furniture requirement now.');
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInputPrompt(transcript);
        setIsListening(false);
        showToast(`Voice captured: "${transcript}"`);
      };

      recognition.onerror = () => {
        setIsListening(false);
        showToast('Could not recognize voice. Please try typing.');
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } catch (e) {
      setIsListening(false);
      showToast('Microphone permission required for voice input.');
    }
  };

  // Helper to match catalog products based on query text
  const getProductRecommendations = (text: string): string[] => {
    const lower = text.toLowerCase();
    const matched = products.filter(p => {
      const catMatch = p.category.toLowerCase().includes(lower) || lower.includes(p.category.toLowerCase().split(' ')[0]);
      const nameMatch = p.name.toLowerCase().includes(lower) || lower.includes(p.name.toLowerCase().split(' ')[0]);
      const woodMatch = p.woodType.toLowerCase().includes(lower);
      return catMatch || nameMatch || woodMatch;
    });

    if (matched.length > 0) {
      return matched.slice(0, 3).map(p => p.id);
    }

    if (lower.includes('sofa') || lower.includes('living')) {
      return products.filter(p => p.category.includes('Sofa')).slice(0, 2).map(p => p.id);
    }
    if (lower.includes('bed') || lower.includes('bedroom')) {
      return products.filter(p => p.category.includes('Bedroom')).slice(0, 2).map(p => p.id);
    }
    if (lower.includes('dining') || lower.includes('table')) {
      return products.filter(p => p.category.includes('Dining')).slice(0, 2).map(p => p.id);
    }
    return [];
  };

  const handleSendPrompt = async (promptText: string) => {
    if (!promptText.trim() || isLoading) return;

    const userMsg: AiChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: promptText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputPrompt('');
    setIsLoading(true);

    // Check if user clicked custom order prompt
    if (promptText.toLowerCase().includes('custom furniture') || promptText.toLowerCase().includes('custom order')) {
      setIsCustomWizardActive(true);
    }

    try {
      const replyText = await askAiFurnitureAdvisor(promptText, undefined, products);
      const recommendedIds = getProductRecommendations(promptText);

      const aiMsg: AiChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        recommendedProductIds: recommendedIds.length > 0 ? recommendedIds : undefined,
        quickReplies: [
          '✨ Custom Furniture Quote',
          '💳 Bank & Payment Details',
          '🚚 Cargo Delivery Info',
          '📞 Contact Human Support'
        ]
      };

      setMessages(prev => [...prev, aiMsg]);
    } catch (err) {
      setMessages(prev => [...prev, {
        id: `ai-err-${Date.now()}`,
        sender: 'ai',
        text: 'Assalam-o-Alaikum! For urgent inquiries, you can contact Muhammad Zahid Iqbal directly on WhatsApp: 0309-3509242 or Call 0302-0940219.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        showHumanSupport: true
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCustomWizardSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!wizName || !wizPhone) {
      showToast('Please enter your Name and Phone Number to submit custom inquiry.');
      return;
    }

    const createdReq = submitCustomOrder({
      customerName: wizName,
      phone: wizPhone,
      email: `${wizName.toLowerCase().replace(/\s+/g, '')}@gmail.com`,
      city: 'Pakistan',
      category: wizType,
      preferredDesignTitle: `Custom AI Request: ${wizType}`,
      dimensions: wizDimensions,
      woodType: wizWood,
      colourStain: wizStain,
      budgetPkr: wizBudget,
      specialRequirements: wizNotes || 'Requested via IQBAL WOODCRAFT AI Assistant Wizard'
    });

    setIsCustomWizardActive(false);

    const confirmationMsg: AiChatMessage = {
      id: `ai-cust-${Date.now()}`,
      sender: 'ai',
      text: `JazakAllah ${wizName}! Your custom furniture request (#${createdReq.id}) has been successfully submitted to the IQBAL WOODCRAFT Master Craftsmen Admin Team.\n\nOur Business Manager Muhammad Zahid Iqbal will review your specifications (${wizType} in ${wizWood}) and contact you at ${wizPhone} via phone call / WhatsApp with complete 3D shop drawings and a detailed valuation.`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isCustomOrderSuccess: true,
      customOrderRefId: createdReq.id,
      quickReplies: ['💬 Chat on WhatsApp', '💳 View Advance Payment Terms', '📦 View Catalog']
    };

    setMessages(prev => [...prev, confirmationMsg]);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex justify-end">
      <div className="bg-stone-950 border-l border-[#d4af37]/60 w-full max-w-lg h-full flex flex-col justify-between text-white shadow-2xl relative">
        
        {/* Top Header */}
        <div className="p-4 bg-gradient-to-r from-stone-950 via-stone-900 to-stone-950 border-b border-[#d4af37]/40 flex items-center justify-between shadow-md">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#d4af37] to-[#8b5a2b] p-0.5 shadow-lg">
                <div className="w-full h-full bg-stone-950 rounded-[10px] flex items-center justify-center">
                  <Bot className="w-5 h-5 text-[#d4af37]" />
                </div>
              </div>
              <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-emerald-500 border-2 border-stone-950 rounded-full animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-serif font-bold text-amber-100 text-base">
                  IQBAL WOODCRAFT AI Consultant
                </h3>
              </div>
              <p className="text-[11px] text-[#d4af37] font-semibold flex items-center gap-1 mt-0.5">
                <Sparkles className="w-3.5 h-3.5 text-blue-400" /> Powered by Gemini AI
              </p>
            </div>
          </div>
          <button 
            onClick={() => setIsAiConsultantOpen(false)} 
            className="p-1.5 text-stone-400 hover:text-white rounded-lg hover:bg-stone-900 transition"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* 100% Advance Payment & COD Notice Bar */}
        <div className="bg-stone-900/90 border-b border-[#d4af37]/20 px-4 py-2 flex items-center justify-between text-[11px] text-amber-200/90">
          <div className="flex items-center gap-1.5">
            <AlertCircle className="w-3.5 h-3.5 text-[#d4af37] shrink-0" />
            <span><strong>Payment Policy:</strong> 100% Advance Payment via Bank Transfer / JazzCash / EasyPaisa.</span>
          </div>
          <span className="bg-red-950 text-red-300 font-bold px-1.5 py-0.5 rounded text-[10px] uppercase tracking-wider shrink-0 border border-red-800/50">
            No COD
          </span>
        </div>

        {/* Chat Messages Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs leading-relaxed">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}
            >
              {/* Message Header */}
              <div className="flex items-center gap-1.5 mb-1 text-[10px] text-stone-400 px-1">
                {m.sender === 'user' ? (
                  <>
                    <span>You</span>
                    <User className="w-3 h-3 text-[#d4af37]" />
                  </>
                ) : (
                  <>
                    <Bot className="w-3 h-3 text-[#d4af37]" />
                    <span className="font-serif font-bold text-amber-200">IQBAL WOODCRAFT AI</span>
                  </>
                )}
                <span>• {m.timestamp}</span>
              </div>

              {/* Message Bubble */}
              <div
                className={`max-w-[90%] p-3.5 rounded-2xl ${
                  m.sender === 'user'
                    ? 'bg-gradient-to-r from-[#d4af37] to-[#b89528] text-stone-950 font-semibold rounded-tr-none shadow-md'
                    : 'bg-stone-900 border border-stone-800 text-stone-200 rounded-tl-none shadow-inner'
                }`}
              >
                <div className="whitespace-pre-wrap">{m.text}</div>

                {/* Custom Order Confirmation Card */}
                {m.isCustomOrderSuccess && (
                  <div className="mt-3 p-3 bg-stone-950 border border-emerald-500/50 rounded-xl text-emerald-300 space-y-1">
                    <div className="flex items-center gap-2 font-bold text-xs text-emerald-400">
                      <CheckCircle className="w-4 h-4 text-emerald-400" />
                      Inquiry Ref ID: {m.customOrderRefId}
                    </div>
                    <p className="text-[11px] text-stone-300">
                      Status: <span className="text-amber-300 font-bold">Pending Review by Master Artisan</span>
                    </p>
                  </div>
                )}

                {/* Recommended Product Cards inside Chat Bubble */}
                {m.recommendedProductIds && m.recommendedProductIds.length > 0 && (
                  <div className="mt-3 space-y-2 border-t border-stone-800 pt-3">
                    <p className="text-[11px] font-bold text-amber-300 flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-[#d4af37]" /> Recommended Products from Showroom Catalog:
                    </p>
                    <div className="grid grid-cols-1 gap-2">
                      {m.recommendedProductIds.map(prodId => {
                        const prod = products.find(p => p.id === prodId);
                        if (!prod) return null;
                        return (
                          <div 
                            key={prod.id} 
                            className="bg-stone-950 border border-stone-800 rounded-xl p-2.5 flex items-center gap-3 hover:border-[#d4af37]/60 transition"
                          >
                            <img 
                              src={prod.images[0]} 
                              alt={prod.name} 
                              className="w-14 h-14 object-cover rounded-lg border border-stone-800"
                            />
                            <div className="flex-1 min-w-0">
                              <h4 className="font-serif font-bold text-amber-100 text-xs truncate">{prod.name}</h4>
                              <p className="text-[10px] text-amber-400 font-semibold mt-0.5">
                                PKR {prod.price.toLocaleString()}
                              </p>
                              <p className="text-[10px] text-stone-400 truncate">{prod.woodType}</p>
                              <div className="flex items-center gap-1.5 mt-1.5">
                                <button
                                  onClick={() => {
                                    setSelectedProductId(prod.id);
                                    setCurrentScreen('product-detail');
                                    setIsAiConsultantOpen(false);
                                  }}
                                  className="px-2 py-1 bg-stone-800 hover:bg-stone-700 text-stone-200 text-[10px] font-bold rounded flex items-center gap-1"
                                >
                                  <Eye className="w-3 h-3" /> View
                                </button>
                                <button
                                  onClick={() => addToCart(prod)}
                                  className="px-2 py-1 bg-[#d4af37] text-black text-[10px] font-extrabold rounded flex items-center gap-1 hover:brightness-110"
                                >
                                  <ShoppingBag className="w-3 h-3" /> Add Cart
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              {/* Quick Reply Chips attached to AI message */}
              {m.quickReplies && m.quickReplies.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1.5 max-w-[90%]">
                  {m.quickReplies.map((qr, qidx) => (
                    <button
                      key={qidx}
                      onClick={() => {
                        if (qr.includes('WhatsApp')) {
                          window.open(`https://wa.me/92${contactInfo.whatsappBusiness.replace(/[^0-9]/g, '').slice(1)}`, '_blank');
                        } else if (qr.includes('Human')) {
                          setShowHumanContacts(true);
                        } else if (qr.includes('Custom')) {
                          setIsCustomWizardActive(true);
                        } else {
                          handleSendPrompt(qr);
                        }
                      }}
                      className="px-2.5 py-1 bg-stone-900 border border-stone-800 hover:border-[#d4af37] text-amber-200 text-[11px] font-medium rounded-xl hover:bg-stone-800 transition shadow-sm flex items-center gap-1"
                    >
                      {qr}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}

          {/* Interactive Custom Furniture Guided Assistant Wizard inside Drawer */}
          {isCustomWizardActive && (
            <div className="bg-stone-900 border-2 border-[#d4af37] rounded-2xl p-4 shadow-2xl space-y-3 animate-fadeIn">
              <div className="flex items-center justify-between border-b border-stone-800 pb-2">
                <div className="flex items-center gap-2">
                  <Wrench className="w-4 h-4 text-[#d4af37]" />
                  <h4 className="font-serif font-bold text-amber-100 text-xs">
                    Custom Furniture Guided AI Order
                  </h4>
                </div>
                <button 
                  onClick={() => setIsCustomWizardActive(false)}
                  className="text-stone-400 hover:text-white text-xs"
                >
                  Cancel
                </button>
              </div>

              <form onSubmit={handleCustomWizardSubmit} className="space-y-2.5 text-xs">
                <div>
                  <label className="text-[11px] text-amber-300 font-medium block mb-1">Furniture Type / Suite:</label>
                  <select 
                    value={wizType}
                    onChange={(e) => setWizType(e.target.value)}
                    className="w-full bg-stone-950 border border-stone-700 rounded-xl px-3 py-1.5 text-amber-100 outline-none focus:border-[#d4af37]"
                  >
                    <option value="Royal King Bedroom Suite">Royal King Bedroom Suite</option>
                    <option value="Luxury Carved Sofa Set">Luxury Carved Sofa Set</option>
                    <option value="Royal Dining Table Set (8-12 Seater)">Royal Dining Table Set (8-12 Seater)</option>
                    <option value="Executive Office Desk & Chair">Executive Office Desk & Chair</option>
                    <option value="Custom Solid Wood Main Door">Custom Solid Wood Main Door</option>
                    <option value="Console Table & Mirror Accent">Console Table & Mirror Accent</option>
                    <option value="Custom Bespoke Furniture Requirement">Custom Bespoke Furniture Requirement</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[11px] text-amber-300 font-medium block mb-1">Wood Timber:</label>
                    <select 
                      value={wizWood}
                      onChange={(e) => setWizWood(e.target.value as WoodType)}
                      className="w-full bg-stone-950 border border-stone-700 rounded-xl px-2.5 py-1.5 text-amber-100 outline-none focus:border-[#d4af37]"
                    >
                      <option value="Solid Sheesham (Chinioti Rosewood)">Solid Sheesham (Rosewood)</option>
                      <option value="Teak Wood (Sagwan)">Teak Wood (Sagwan)</option>
                      <option value="Walnut Wood (Akhrot)">Walnut Wood (Akhrot)</option>
                      <option value="Oak Wood">Oak Wood</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[11px] text-amber-300 font-medium block mb-1">Finish / Stain:</label>
                    <input 
                      type="text" 
                      value={wizStain} 
                      onChange={(e) => setWizStain(e.target.value)}
                      placeholder="e.g. Walnut High Gloss"
                      className="w-full bg-stone-950 border border-stone-700 rounded-xl px-2.5 py-1.5 text-amber-100 outline-none focus:border-[#d4af37]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[11px] text-amber-300 font-medium block mb-1">Dimensions / Size:</label>
                    <input 
                      type="text" 
                      value={wizDimensions} 
                      onChange={(e) => setWizDimensions(e.target.value)}
                      placeholder="e.g. 6x6.5 ft or 12 ft table"
                      className="w-full bg-stone-950 border border-stone-700 rounded-xl px-2.5 py-1.5 text-amber-100 outline-none focus:border-[#d4af37]"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-amber-300 font-medium block mb-1">Budget Range (PKR):</label>
                    <input 
                      type="number" 
                      value={wizBudget} 
                      onChange={(e) => setWizBudget(Number(e.target.value))}
                      className="w-full bg-stone-950 border border-stone-700 rounded-xl px-2.5 py-1.5 text-amber-100 outline-none focus:border-[#d4af37]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[11px] text-amber-300 font-medium block mb-1">Your Full Name *:</label>
                    <input 
                      type="text" 
                      required
                      value={wizName} 
                      onChange={(e) => setWizName(e.target.value)}
                      placeholder="e.g. Mian Kamran"
                      className="w-full bg-stone-950 border border-stone-700 rounded-xl px-2.5 py-1.5 text-amber-100 outline-none focus:border-[#d4af37]"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-amber-300 font-medium block mb-1">WhatsApp/Phone *:</label>
                    <input 
                      type="text" 
                      required
                      value={wizPhone} 
                      onChange={(e) => setWizPhone(e.target.value)}
                      placeholder="0300-1234567"
                      className="w-full bg-stone-950 border border-stone-700 rounded-xl px-2.5 py-1.5 text-amber-100 outline-none focus:border-[#d4af37]"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-2 bg-gradient-to-r from-[#d4af37] to-[#b89528] text-stone-950 font-extrabold rounded-xl hover:brightness-110 shadow-lg flex items-center justify-center gap-2 mt-2"
                >
                  <CheckCircle className="w-4 h-4" /> Submit Custom Request to Admin
                </button>
              </form>
            </div>
          )}

          {/* Loading Bot Indicator */}
          {isLoading && (
            <div className="flex items-center gap-2 text-xs text-amber-300 italic bg-stone-900 border border-stone-800 p-3 rounded-2xl w-max">
              <Bot className="w-4 h-4 animate-spin text-[#d4af37]" />
              IQBAL WOODCRAFT AI Assistant is analyzing woodcraft catalog...
            </div>
          )}

          <div ref={chatEndRef} />
        </div>

        {/* Human Executive Support Expandable Card */}
        {showHumanContacts && (
          <div className="p-4 bg-stone-900 border-t border-[#d4af37] text-xs space-y-2 animate-fadeIn">
            <div className="flex items-center justify-between">
              <h4 className="font-serif font-bold text-amber-200 flex items-center gap-1.5">
                <PhoneCall className="w-4 h-4 text-emerald-400" /> Executive Human Support Team
              </h4>
              <button onClick={() => setShowHumanContacts(false)} className="text-stone-400 hover:text-white text-[10px]">
                Close
              </button>
            </div>
            <div className="grid grid-cols-1 gap-2 text-[11px]">
              <div className="p-2 bg-stone-950 rounded-xl border border-stone-800 flex items-center justify-between">
                <div>
                  <p className="font-bold text-amber-100">{contactInfo.ceo}</p>
                  <p className="text-[10px] text-stone-400">Chief Executive Officer (CEO)</p>
                </div>
                <a href={`tel:${contactInfo.ceoPhone}`} className="text-emerald-400 font-bold hover:underline">
                  {contactInfo.ceoPhone}
                </a>
              </div>
              <div className="p-2 bg-stone-950 rounded-xl border border-stone-800 flex items-center justify-between">
                <div>
                  <p className="font-bold text-amber-100">{contactInfo.businessManager}</p>
                  <p className="text-[10px] text-stone-400">Business Manager</p>
                </div>
                <a href={`tel:${contactInfo.bmPhone}`} className="text-emerald-400 font-bold hover:underline">
                  {contactInfo.bmPhone}
                </a>
              </div>
              <div className="p-2 bg-stone-950 rounded-xl border border-stone-800 flex items-center justify-between">
                <div>
                  <p className="font-bold text-amber-100">{contactInfo.salesAndApp}</p>
                  <p className="text-[10px] text-stone-400">Sales & App Management</p>
                </div>
                <a href={`tel:${contactInfo.salesPhone}`} className="text-emerald-400 font-bold hover:underline">
                  {contactInfo.salesPhone}
                </a>
              </div>
            </div>
            <a
              href={`https://wa.me/92${contactInfo.whatsappBusiness.replace(/[^0-9]/g, '').slice(1)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl flex items-center justify-center gap-2"
            >
              <MessageSquare className="w-4 h-4" /> Direct WhatsApp Chat: {contactInfo.whatsappBusiness}
            </a>
          </div>
        )}

        {/* Executive Escalation Bar */}
        <div className="px-4 py-2 bg-stone-950 border-t border-stone-800 flex items-center justify-between text-[11px] text-stone-300">
          <button 
            onClick={() => setShowHumanContacts(prev => !prev)}
            className="text-amber-300 font-bold hover:underline flex items-center gap-1"
          >
            <PhoneCall className="w-3.5 h-3.5 text-[#d4af37]" /> Contact Executive Team
          </button>
          <a
            href={`https://wa.me/92${contactInfo.whatsappBusiness.replace(/[^0-9]/g, '').slice(1)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-emerald-400 font-bold flex items-center gap-1 hover:underline"
          >
            <MessageSquare className="w-3.5 h-3.5" /> WhatsApp: {contactInfo.whatsappBusiness}
          </a>
        </div>

        {/* Input Bar with Voice Button */}
        <form 
          onSubmit={(e) => {
            e.preventDefault();
            handleSendPrompt(inputPrompt);
          }} 
          className="p-3 bg-stone-950 border-t border-stone-800 flex items-center gap-2"
        >
          <button
            type="button"
            onClick={handleVoiceInput}
            title="Voice input (Speech to Text)"
            className={`p-2.5 rounded-xl border transition ${
              isListening 
                ? 'bg-red-600 border-red-500 text-white animate-pulse' 
                : 'bg-stone-900 border-stone-700 text-amber-300 hover:bg-stone-800'
            }`}
          >
            {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
          </button>

          <input
            type="text"
            placeholder={isListening ? "Listening... speak now" : "Ask about Sheesham wood, prices, custom furniture..."}
            value={inputPrompt}
            onChange={(e) => setInputPrompt(e.target.value)}
            className="flex-1 bg-stone-900 border border-stone-700 rounded-xl px-3 py-2 text-xs text-amber-100 outline-none focus:border-[#d4af37]"
          />

          <button
            type="submit"
            disabled={isLoading || !inputPrompt.trim()}
            className="p-2.5 bg-gradient-to-r from-[#d4af37] to-[#b89528] text-stone-950 font-bold rounded-xl hover:brightness-110 disabled:opacity-40 transition shadow-md"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>

      </div>
    </div>
  );
};
