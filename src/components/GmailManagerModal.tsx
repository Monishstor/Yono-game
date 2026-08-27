import React, { useState, useEffect } from 'react';
import {
  X,
  Mail,
  Send,
  Inbox,
  RefreshCw,
  Search,
  Trash2,
  AlertCircle,
  CheckCircle2,
  Sparkles,
  ArrowLeft,
  LogOut,
  ShieldCheck,
  Tag,
  Paperclip,
  Clock
} from 'lucide-react';
import {
  listGmailMessages,
  getGmailMessage,
  sendGmailEmail,
  trashGmailMessage,
  hasActiveGmailSession,
  disconnectGmailSession,
  GmailMessageSummary,
  GmailMessageDetail
} from '../lib/googleGmail';

interface GmailManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultRecipient?: string;
  defaultSubject?: string;
  shareReferralCode?: string;
  shareAppName?: string;
  shareUrl?: string;
}

type TabType = 'inbox' | 'compose' | 'templates';

export const GmailManagerModal: React.FC<GmailManagerModalProps> = ({
  isOpen,
  onClose,
  defaultRecipient = '',
  defaultSubject = '',
  shareReferralCode = 'YONO999',
  shareAppName = 'Yono VIP Games',
  shareUrl = window.location.origin
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('inbox');
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Messages state
  const [messages, setMessages] = useState<GmailMessageSummary[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedMessage, setSelectedMessage] = useState<GmailMessageDetail | null>(null);
  const [loadingDetail, setLoadingDetail] = useState<boolean>(false);

  // Compose State
  const [toField, setToField] = useState<string>(defaultRecipient);
  const [subjectField, setSubjectField] = useState<string>(defaultSubject);
  const [bodyField, setBodyField] = useState<string>('');
  const [isSending, setIsSending] = useState<boolean>(false);
  const [sendSuccess, setSendSuccess] = useState<boolean>(false);

  // Confirmations
  const [confirmSendOpen, setConfirmSendOpen] = useState<boolean>(false);
  const [trashCandidateId, setTrashCandidateId] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      if (defaultRecipient) {
        setToField(defaultRecipient);
        setActiveTab('compose');
      }
      if (defaultSubject) {
        setSubjectField(defaultSubject);
      }

      if (hasActiveGmailSession()) {
        setIsConnected(true);
        loadInbox();
      } else {
        setIsConnected(false);
      }
    }
  }, [isOpen, defaultRecipient, defaultSubject]);

  const loadInbox = async (query?: string) => {
    setLoading(true);
    setError(null);
    try {
      const list = await listGmailMessages(query || searchQuery, 25);
      setMessages(list);
      setIsConnected(true);
    } catch (err: any) {
      setError(err?.message || 'Failed to connect to Gmail.');
      setIsConnected(false);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenMessage = async (msgId: string) => {
    setLoadingDetail(true);
    try {
      const full = await getGmailMessage(msgId);
      setSelectedMessage(full);
    } catch (err: any) {
      alert('Failed to load email message: ' + (err?.message || 'Error'));
    } finally {
      setLoadingDetail(false);
    }
  };

  const handleDisconnect = () => {
    disconnectGmailSession();
    setIsConnected(false);
    setMessages([]);
    setSelectedMessage(null);
  };

  const handleApplyTemplate = (type: 'referral' | 'vip_bonus' | 'withdrawal_alert') => {
    if (type === 'referral') {
      setSubjectField(`🔥 Exclusive Free Bonus: Join ${shareAppName}!`);
      setBodyField(
        `Hey there,\n\n` +
        `I wanted to invite you to play on ${shareAppName}! You can get an instant signup bonus with fast UPI/Bank withdrawals.\n\n` +
        `🎁 My VIP Referral Code: ${shareReferralCode}\n` +
        `👉 Download & Claim Bonus: ${shareUrl}\n\n` +
        `Good luck and happy gaming!`
      );
    } else if (type === 'vip_bonus') {
      setSubjectField(`🎁 Daily VIP Bonus Alert: Claim Your Free ₹500 Chips!`);
      setBodyField(
        `Greetings VIP Member,\n\n` +
        `Today's special bonus is unlocked for ${shareAppName}.\n` +
        `Claim your free daily chips before midnight.\n\n` +
        `Promo Code: ${shareReferralCode}\n` +
        `Visit: ${shareUrl}\n\n` +
        `Best regards,\nVIP Support Team`
      );
    } else if (type === 'withdrawal_alert') {
      setSubjectField(`✅ Payment Notification: Fast Instant Withdrawals Active`);
      setBodyField(
        `Hello,\n\n` +
        `Our 24/7 instant IMPS & UPI payment gateways are operating at 100% speed today.\n\n` +
        `Log in now to enjoy instant payouts: ${shareUrl}\n\n` +
        `Support Team`
      );
    }
    setActiveTab('compose');
  };

  const handleSendEmail = async () => {
    if (!toField.trim() || !subjectField.trim() || !bodyField.trim()) {
      alert('Please fill out recipient, subject, and message body.');
      return;
    }

    setIsSending(true);
    try {
      await sendGmailEmail({
        to: toField.trim(),
        subject: subjectField.trim(),
        messageText: bodyField.trim()
      });
      setSendSuccess(true);
      setConfirmSendOpen(false);
      setToField('');
      setSubjectField('');
      setBodyField('');
      setTimeout(() => {
        setSendSuccess(false);
        setActiveTab('inbox');
        loadInbox();
      }, 2000);
    } catch (err: any) {
      alert('Failed to send email: ' + (err?.message || 'Error'));
    } finally {
      setIsSending(false);
    }
  };

  const confirmTrash = async () => {
    if (!trashCandidateId) return;
    try {
      await trashGmailMessage(trashCandidateId);
      setMessages((prev) => prev.filter((m) => m.id !== trashCandidateId));
      if (selectedMessage?.id === trashCandidateId) {
        setSelectedMessage(null);
      }
      setTrashCandidateId(null);
    } catch (err: any) {
      alert('Failed to trash message: ' + (err?.message || 'Error'));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div 
        id="gmail-manager-modal"
        className="relative w-full max-w-4xl bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col h-[85vh] max-h-[750px]"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/70">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-red-600 via-rose-500 to-amber-500 flex items-center justify-center text-white shadow-md">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
                Gmail Inbox & Mailer
                <span className="text-[11px] font-semibold bg-red-500/10 text-red-400 border border-red-500/20 px-2 py-0.5 rounded-full">
                  Workspace API
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Send invites, manage emails, and track player communications
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isConnected && (
              <>
                <button
                  onClick={() => loadInbox()}
                  disabled={loading}
                  className="p-2 rounded-xl text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors cursor-pointer disabled:opacity-50"
                  title="Refresh Inbox"
                >
                  <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-red-400' : ''}`} />
                </button>
                <button
                  onClick={handleDisconnect}
                  className="p-2 rounded-xl text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer"
                  title="Disconnect Gmail Account"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </>
            )}
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        {isConnected && (
          <div className="flex items-center gap-2 px-6 pt-3 pb-0 border-b border-slate-800 bg-slate-950/40">
            <button
              onClick={() => {
                setActiveTab('inbox');
                setSelectedMessage(null);
              }}
              className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold border-b-2 transition-all cursor-pointer ${
                activeTab === 'inbox'
                  ? 'border-red-500 text-red-400 bg-red-500/5'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <Inbox className="w-4 h-4" />
              <span>Inbox ({messages.length})</span>
            </button>
            <button
              onClick={() => {
                setActiveTab('compose');
                setSelectedMessage(null);
              }}
              className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold border-b-2 transition-all cursor-pointer ${
                activeTab === 'compose'
                  ? 'border-red-500 text-red-400 bg-red-500/5'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <Send className="w-4 h-4" />
              <span>Compose Email</span>
            </button>
            <button
              onClick={() => {
                setActiveTab('templates');
                setSelectedMessage(null);
              }}
              className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold border-b-2 transition-all cursor-pointer ${
                activeTab === 'templates'
                  ? 'border-red-500 text-red-400 bg-red-500/5'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Referral Templates</span>
            </button>
          </div>
        )}

        {/* Modal Main Body */}
        {!isConnected && !loading ? (
          <div className="p-8 text-center space-y-5 my-auto">
            <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-400 flex items-center justify-center mx-auto shadow-inner">
              <Mail className="w-8 h-8" />
            </div>
            <div className="max-w-md mx-auto space-y-2">
              <h3 className="text-lg font-bold text-slate-100">
                Connect Your Gmail Account
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Connect your Google account to read incoming gaming notifications, send personalized referral codes to friends, or launch email campaigns for <strong className="text-slate-200">{shareAppName}</strong>.
              </p>
            </div>

            {error && (
              <div className="p-3 bg-red-950/40 border border-red-500/30 rounded-xl max-w-md mx-auto text-left flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                <div className="text-xs text-red-300">
                  <p className="font-semibold">Authentication Error:</p>
                  <p className="text-[11px] text-red-400 mt-0.5">{error}</p>
                </div>
              </div>
            )}

            <div className="pt-2">
              <button
                id="connect-gmail-btn"
                onClick={() => loadInbox()}
                className="inline-flex items-center gap-2.5 px-6 py-3 rounded-xl bg-gradient-to-r from-red-600 via-rose-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white font-bold text-xs shadow-lg shadow-red-500/20 transition-all hover:scale-105 active:scale-95 cursor-pointer"
              >
                <Mail className="w-4 h-4" />
                <span>Connect & Authorize Gmail</span>
              </button>
            </div>

            <div className="flex items-center justify-center gap-2 text-[11px] text-slate-500">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Official Google Identity Services OAuth 2.0</span>
            </div>
          </div>
        ) : (
          <div className="flex-1 overflow-hidden flex flex-col">
            {/* INBOX TAB */}
            {activeTab === 'inbox' && (
              <div className="flex-1 flex flex-col overflow-hidden">
                {/* Search Bar */}
                {!selectedMessage && (
                  <div className="p-3 border-b border-slate-800 bg-slate-900/40 flex items-center gap-3">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input
                        type="text"
                        placeholder="Search Gmail (e.g. from:yono, subject:bonus)..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && loadInbox(searchQuery)}
                        className="w-full bg-slate-950 text-slate-100 text-xs pl-9 pr-4 py-2 rounded-xl border border-slate-700/80 focus:outline-hidden focus:border-red-500 transition-all placeholder:text-slate-500"
                      />
                    </div>
                    <button
                      onClick={() => loadInbox(searchQuery)}
                      className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl cursor-pointer"
                    >
                      Search
                    </button>
                  </div>
                )}

                {/* Message View OR Message List */}
                {selectedMessage ? (
                  <div className="flex-1 overflow-y-auto p-6 space-y-4 animate-fade-in bg-slate-900/60">
                    <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                      <button
                        onClick={() => setSelectedMessage(null)}
                        className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-200 font-semibold cursor-pointer"
                      >
                        <ArrowLeft className="w-4 h-4" />
                        <span>Back to Inbox</span>
                      </button>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            setToField(selectedMessage.from || '');
                            setSubjectField(`Re: ${selectedMessage.subject || ''}`);
                            setActiveTab('compose');
                          }}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-600/20 text-red-400 hover:bg-red-600/30 text-xs font-bold border border-red-500/30 cursor-pointer"
                        >
                          <Send className="w-3.5 h-3.5" />
                          <span>Reply</span>
                        </button>
                        <button
                          onClick={() => setTrashCandidateId(selectedMessage.id)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-500/10 cursor-pointer"
                          title="Trash message"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-base font-bold text-slate-100">{selectedMessage.subject}</h3>
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-400 mt-2">
                        <span><strong>From:</strong> {selectedMessage.from}</span>
                        {selectedMessage.to && <span><strong>To:</strong> {selectedMessage.to}</span>}
                        {selectedMessage.date && (
                          <span className="flex items-center gap-1 text-slate-500">
                            <Clock className="w-3.5 h-3.5" />
                            {selectedMessage.date}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-slate-300 leading-relaxed space-y-3 font-sans">
                      {selectedMessage.bodyHtml ? (
                        <div
                          className="prose prose-invert max-w-none text-xs"
                          dangerouslySetInnerHTML={{ __html: selectedMessage.bodyHtml }}
                        />
                      ) : (
                        <pre className="whitespace-pre-wrap font-sans text-xs">{selectedMessage.bodyText}</pre>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="flex-1 overflow-y-auto p-4 space-y-2">
                    {loading ? (
                      <div className="py-16 text-center space-y-3">
                        <RefreshCw className="w-8 h-8 text-red-400 animate-spin mx-auto" />
                        <p className="text-xs font-semibold text-slate-300">Fetching messages from Gmail...</p>
                      </div>
                    ) : messages.length === 0 ? (
                      <div className="py-16 text-center space-y-2">
                        <Inbox className="w-8 h-8 text-slate-600 mx-auto" />
                        <p className="text-xs font-semibold text-slate-400">No messages found in your inbox</p>
                      </div>
                    ) : (
                      messages.map((msg) => (
                        <div
                          key={msg.id}
                          onClick={() => handleOpenMessage(msg.id)}
                          className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-4 ${
                            msg.unread
                              ? 'bg-slate-950/80 border-red-500/40 hover:border-red-500'
                              : 'bg-slate-950/40 border-slate-800/80 hover:border-slate-700'
                          }`}
                        >
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2">
                              {msg.unread && (
                                <span className="w-2 h-2 rounded-full bg-red-500 shrink-0" />
                              )}
                              <span className={`text-xs truncate ${msg.unread ? 'font-bold text-slate-100' : 'text-slate-300'}`}>
                                {msg.from}
                              </span>
                            </div>
                            <h4 className={`text-xs mt-0.5 truncate ${msg.unread ? 'font-bold text-white' : 'text-slate-300'}`}>
                              {msg.subject}
                            </h4>
                            <p className="text-[11px] text-slate-500 truncate mt-0.5">
                              {msg.snippet}
                            </p>
                          </div>

                          <div className="flex items-center gap-2 shrink-0">
                            <span className="text-[10px] text-slate-500">{msg.date?.split(' ')[0] || ''}</span>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setTrashCandidateId(msg.id);
                              }}
                              className="p-1.5 text-slate-600 hover:text-red-400 rounded-lg transition-colors cursor-pointer"
                              title="Delete Email"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>
            )}

            {/* COMPOSE TAB */}
            {activeTab === 'compose' && (
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {sendSuccess && (
                  <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/40 flex items-center gap-3 text-emerald-300 text-xs animate-fade-in">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                    <div>
                      <p className="font-bold">Email sent successfully via Gmail!</p>
                      <p className="text-[11px] text-emerald-400/80">Message has been queued & delivered by Google servers.</p>
                    </div>
                  </div>
                )}

                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Recipient Email (To) *
                    </label>
                    <input
                      type="email"
                      placeholder="player@example.com"
                      value={toField}
                      onChange={(e) => setToField(e.target.value)}
                      className="w-full bg-slate-950 text-slate-100 text-xs px-3.5 py-2.5 rounded-xl border border-slate-700 focus:outline-hidden focus:border-red-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Subject Line *
                    </label>
                    <input
                      type="text"
                      placeholder="Special Signup Bonus Inside!"
                      value={subjectField}
                      onChange={(e) => setSubjectField(e.target.value)}
                      className="w-full bg-slate-950 text-slate-100 text-xs px-3.5 py-2.5 rounded-xl border border-slate-700 focus:outline-hidden focus:border-red-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Message Content (Plain Text) *
                    </label>
                    <textarea
                      rows={8}
                      placeholder="Type your message here..."
                      value={bodyField}
                      onChange={(e) => setBodyField(e.target.value)}
                      className="w-full bg-slate-950 text-slate-100 text-xs p-3.5 rounded-xl border border-slate-700 focus:outline-hidden focus:border-red-500 font-mono leading-relaxed"
                    />
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleApplyTemplate('referral')}
                        className="text-[11px] font-semibold text-amber-400 hover:text-amber-300 underline cursor-pointer"
                      >
                        Use Referral Template
                      </button>
                    </div>

                    <button
                      type="button"
                      disabled={isSending || !toField.trim() || !subjectField.trim()}
                      onClick={() => setConfirmSendOpen(true)}
                      className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-bold text-xs shadow-md transition-all cursor-pointer disabled:opacity-50"
                    >
                      <Send className="w-4 h-4" />
                      <span>{isSending ? 'Sending via Gmail...' : 'Send Email'}</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* TEMPLATES TAB */}
            {activeTab === 'templates' && (
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                <div className="space-y-1">
                  <h3 className="text-sm font-bold text-slate-100">Ready-Made Email Templates</h3>
                  <p className="text-xs text-slate-400">
                    Click any pre-written template below to instantly load it into the email composer.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
                  <div
                    onClick={() => handleApplyTemplate('referral')}
                    className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 hover:border-amber-500/50 hover:bg-slate-950 transition-all cursor-pointer space-y-2 group"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
                        <Tag className="w-3.5 h-3.5" />
                        Referral Invite
                      </span>
                      <span className="text-[10px] text-slate-500 group-hover:text-amber-400 font-semibold">Apply →</span>
                    </div>
                    <p className="text-xs font-semibold text-slate-200">Free Signup Bonus</p>
                    <p className="text-[11px] text-slate-400 line-clamp-3">
                      Includes custom referral code {shareReferralCode} and direct download link.
                    </p>
                  </div>

                  <div
                    onClick={() => handleApplyTemplate('vip_bonus')}
                    className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 hover:border-red-500/50 hover:bg-slate-950 transition-all cursor-pointer space-y-2 group"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-red-400 flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5" />
                        Daily VIP Alert
                      </span>
                      <span className="text-[10px] text-slate-500 group-hover:text-red-400 font-semibold">Apply →</span>
                    </div>
                    <p className="text-xs font-semibold text-slate-200">Daily Bonus Chips</p>
                    <p className="text-[11px] text-slate-400 line-clamp-3">
                      Notifies users of special daily promotions, check-in streaks, and cashback.
                    </p>
                  </div>

                  <div
                    onClick={() => handleApplyTemplate('withdrawal_alert')}
                    className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 hover:border-emerald-500/50 hover:bg-slate-950 transition-all cursor-pointer space-y-2 group"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Payout Guarantee
                      </span>
                      <span className="text-[10px] text-slate-500 group-hover:text-emerald-400 font-semibold">Apply →</span>
                    </div>
                    <p className="text-xs font-semibold text-slate-200">Instant UPI Transfer</p>
                    <p className="text-[11px] text-slate-400 line-clamp-3">
                      Assures fast IMPS withdrawals and promotes security trust.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Confirmation Modal for SEND (Mandatory User Confirmation) */}
        {confirmSendOpen && (
          <div className="absolute inset-0 bg-slate-950/90 z-30 flex items-center justify-center p-6 animate-fade-in">
            <div className="bg-slate-900 border border-red-500/40 p-6 rounded-2xl max-w-md w-full text-center space-y-4 shadow-2xl">
              <div className="w-12 h-12 rounded-full bg-red-500/10 text-red-400 flex items-center justify-center mx-auto border border-red-500/20">
                <Send className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-100">
                  Send Email via your Gmail Account?
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Recipient: <strong className="text-slate-200">{toField}</strong><br />
                  Subject: <strong className="text-slate-200">{subjectField}</strong>
                </p>
              </div>
              <div className="flex gap-3 justify-center pt-2">
                <button
                  onClick={() => setConfirmSendOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  disabled={isSending}
                  onClick={handleSendEmail}
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white text-xs font-bold cursor-pointer disabled:opacity-50"
                >
                  {isSending ? 'Sending...' : 'Yes, Send Email'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Confirmation Modal for TRASH/DELETE (Mandatory User Confirmation) */}
        {trashCandidateId && (
          <div className="absolute inset-0 bg-slate-950/90 z-30 flex items-center justify-center p-6 animate-fade-in">
            <div className="bg-slate-900 border border-red-500/40 p-6 rounded-2xl max-w-md w-full text-center space-y-4 shadow-2xl">
              <div className="w-12 h-12 rounded-full bg-red-500/10 text-red-400 flex items-center justify-center mx-auto border border-red-500/20">
                <Trash2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-100">
                  Move Email to Trash?
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Are you sure you want to move this email to the Gmail Trash folder?
                </p>
              </div>
              <div className="flex gap-3 justify-center pt-2">
                <button
                  onClick={() => setTrashCandidateId(null)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmTrash}
                  className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold cursor-pointer"
                >
                  Confirm Trash
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-800 bg-slate-950/70 flex items-center justify-between text-xs text-slate-400">
          <span>{isConnected ? 'Gmail Workspace Active' : 'Gmail Not Connected'}</span>
          <div className="flex items-center gap-2">
            <span className="text-[11px] text-amber-400 font-semibold">
              Referral Code: <span className="text-slate-100 font-mono">{shareReferralCode}</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
