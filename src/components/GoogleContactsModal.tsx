import React, { useState, useEffect } from 'react';
import { 
  X, 
  Users, 
  Search, 
  Mail, 
  Phone, 
  Share2, 
  UserPlus, 
  Trash2, 
  RefreshCw, 
  Send, 
  Check, 
  Copy,
  AlertCircle,
  ShieldCheck,
  LogOut
} from 'lucide-react';
import { 
  getGoogleContacts, 
  createGoogleContact, 
  deleteGoogleContact, 
  hasActiveContactsSession,
  disconnectContactsSession,
  GoogleContact 
} from '../lib/googleContacts';

interface GoogleContactsModalProps {
  isOpen: boolean;
  onClose: () => void;
  shareReferralCode?: string;
  shareAppName?: string;
  shareUrl?: string;
  onOpenGmailCompose?: (recipientEmail: string, subject?: string) => void;
}

export const GoogleContactsModal: React.FC<GoogleContactsModalProps> = ({
  isOpen,
  onClose,
  shareReferralCode = 'YONO999',
  shareAppName = 'Yono VIP Games',
  shareUrl = window.location.origin,
  onOpenGmailCompose
}) => {
  const [contacts, setContacts] = useState<GoogleContact[]>([]);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState<boolean>(false);

  // New Contact Form State
  const [newGivenName, setNewGivenName] = useState<string>('');
  const [newFamilyName, setNewFamilyName] = useState<string>('');
  const [newEmail, setNewEmail] = useState<string>('');
  const [newPhone, setNewPhone] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Confirmation dialog state for deleting
  const [deleteCandidate, setDeleteCandidate] = useState<GoogleContact | null>(null);

  useEffect(() => {
    if (isOpen) {
      if (hasActiveContactsSession()) {
        setIsConnected(true);
        loadContacts();
      } else {
        setIsConnected(false);
      }
    }
  }, [isOpen]);

  const loadContacts = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await getGoogleContacts(100);
      setContacts(result.contacts);
      setIsConnected(true);
    } catch (err: any) {
      const errMsg = err?.message || 'Failed to connect to Google Contacts.';
      setError(errMsg);
      setIsConnected(false);
    } finally {
      setLoading(false);
    }
  };

  const handleDisconnect = () => {
    disconnectContactsSession();
    setIsConnected(false);
    setContacts([]);
  };

  const handleCreateContact = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGivenName.trim()) return;

    const confirmed = window.confirm(
      `Save "${newGivenName} ${newFamilyName}" to your Google Contacts?`
    );
    if (!confirmed) return;

    setIsSubmitting(true);
    try {
      const created = await createGoogleContact({
        givenName: newGivenName.trim(),
        familyName: newFamilyName.trim() || undefined,
        email: newEmail.trim() || undefined,
        phone: newPhone.trim() || undefined,
      });

      setContacts((prev) => [created, ...prev]);
      setNewGivenName('');
      setNewFamilyName('');
      setNewEmail('');
      setNewPhone('');
      setShowAddForm(false);
    } catch (err: any) {
      alert('Error creating contact: ' + (err?.message || 'Failed to create'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const confirmDeleteContact = async () => {
    if (!deleteCandidate) return;

    try {
      await deleteGoogleContact(deleteCandidate.resourceName);
      setContacts((prev) => prev.filter((c) => c.resourceName !== deleteCandidate.resourceName));
      setDeleteCandidate(null);
    } catch (err: any) {
      alert('Failed to delete contact: ' + (err?.message || 'Error occurred'));
    }
  };

  const handleShareViaEmail = (contact: GoogleContact) => {
    if (!contact.email) return;
    const defaultSub = `Play & Win with ${shareAppName}! (Free Bonus inside)`;
    if (onOpenGmailCompose) {
      onOpenGmailCompose(contact.email, defaultSub);
      return;
    }
    const subject = encodeURIComponent(defaultSub);
    const body = encodeURIComponent(
      `Hey ${contact.givenName || contact.name}!\n\n` +
      `Check out ${shareAppName} to claim daily cash bonuses and signup rewards!\n` +
      `Use my Referral Code: ${shareReferralCode}\n\n` +
      `Download & Play here: ${shareUrl}\n\n` +
      `Have fun and best of luck!`
    );
    window.open(`mailto:${contact.email}?subject=${subject}&body=${body}`, '_blank');
  };

  const handleShareViaWhatsApp = (contact: GoogleContact) => {
    const phone = contact.phone?.replace(/[^0-9+]/g, '') || '';
    const text = encodeURIComponent(
      `🎮 *${shareAppName}* - Best Real Cash Gaming Apps!\n\n` +
      `🎁 Use Referral Code: *${shareReferralCode}* to get an instant bonus!\n\n` +
      `👉 Download here: ${shareUrl}`
    );
    const url = phone 
      ? `https://api.whatsapp.com/send?phone=${phone}&text=${text}`
      : `https://api.whatsapp.com/send?text=${text}`;
    window.open(url, '_blank');
  };

  const handleCopyInvite = (contact: GoogleContact) => {
    const inviteText = `🎮 Play ${shareAppName} with me! Use my referral code ${shareReferralCode} for a free signup bonus: ${shareUrl}`;
    navigator.clipboard.writeText(inviteText);
    setCopiedId(contact.resourceName);
    setTimeout(() => setCopiedId(null), 2000);
  };

  if (!isOpen) return null;

  const filteredContacts = contacts.filter((c) => {
    const q = searchQuery.toLowerCase();
    return (
      c.name.toLowerCase().includes(q) ||
      (c.email && c.email.toLowerCase().includes(q)) ||
      (c.phone && c.phone.includes(q))
    );
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div 
        id="google-contacts-modal"
        className="relative w-full max-w-2xl bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white shadow-md">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
                Google Contacts
                <span className="text-[11px] font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20 px-2 py-0.5 rounded-full">
                  People API
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Sync contacts & invite friends to {shareAppName} with your referral code
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isConnected && (
              <>
                <button
                  onClick={loadContacts}
                  disabled={loading}
                  className="p-2 rounded-xl text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors cursor-pointer disabled:opacity-50"
                  title="Refresh Contacts"
                >
                  <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-blue-400' : ''}`} />
                </button>
                <button
                  onClick={handleDisconnect}
                  className="p-2 rounded-xl text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer"
                  title="Disconnect Google Account"
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

        {/* Not Connected State */}
        {!isConnected && !loading ? (
          <div className="p-8 text-center space-y-5 my-auto">
            <div className="w-16 h-16 rounded-2xl bg-blue-500/10 border border-blue-500/30 text-blue-400 flex items-center justify-center mx-auto shadow-inner">
              <Users className="w-8 h-8" />
            </div>
            <div className="max-w-md mx-auto space-y-2">
              <h3 className="text-lg font-bold text-slate-100">
                Connect Google Account
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Connect your Google Contacts to easily invite friends via WhatsApp, SMS, or Email and earn instant referral commissions when they join <strong className="text-slate-200">{shareAppName}</strong>.
              </p>
            </div>

            {error && (
              <div className="p-3 bg-red-950/40 border border-red-500/30 rounded-xl max-w-md mx-auto text-left flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                <div className="text-xs text-red-300">
                  <p className="font-semibold">Connection Error:</p>
                  <p className="text-[11px] text-red-400 mt-0.5">{error}</p>
                </div>
              </div>
            )}

            <div className="pt-2">
              <button
                id="connect-google-contacts-btn"
                onClick={loadContacts}
                className="inline-flex items-center gap-2.5 px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs shadow-lg shadow-blue-500/20 transition-all hover:scale-105 active:scale-95 cursor-pointer"
              >
                <Users className="w-4 h-4" />
                <span>Connect & Sync Google Contacts</span>
              </button>
            </div>

            <div className="flex items-center justify-center gap-2 text-[11px] text-slate-500">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Safe & Secure OAuth via Google Identity Services</span>
            </div>
          </div>
        ) : (
          <>
            {/* Toolbar & Search */}
            <div className="p-4 border-b border-slate-800 bg-slate-900/40 flex flex-col sm:flex-row gap-3 items-center justify-between">
              <div className="relative w-full sm:w-80">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search contacts by name, email, or phone..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-950 text-slate-100 text-xs pl-9 pr-4 py-2.5 rounded-xl border border-slate-700/80 focus:outline-hidden focus:border-blue-500 transition-all placeholder:text-slate-500"
                />
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                <button
                  onClick={() => setShowAddForm(!showAddForm)}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-sm transition-all cursor-pointer"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>{showAddForm ? 'Close Form' : '+ Add Contact'}</span>
                </button>
              </div>
            </div>

            {/* Add Contact Form Drawer */}
            {showAddForm && (
              <form onSubmit={handleCreateContact} className="p-4 bg-slate-950/90 border-b border-blue-500/30 animate-fade-in space-y-3">
                <h3 className="text-xs font-bold text-blue-400 flex items-center gap-1.5">
                  <UserPlus className="w-3.5 h-3.5" />
                  Add New Google Contact
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <input
                    type="text"
                    placeholder="First Name *"
                    value={newGivenName}
                    onChange={(e) => setNewGivenName(e.target.value)}
                    required
                    className="bg-slate-900 text-slate-100 text-xs px-3 py-2 rounded-xl border border-slate-700 focus:outline-hidden focus:border-blue-500"
                  />
                  <input
                    type="text"
                    placeholder="Last Name"
                    value={newFamilyName}
                    onChange={(e) => setNewFamilyName(e.target.value)}
                    className="bg-slate-900 text-slate-100 text-xs px-3 py-2 rounded-xl border border-slate-700 focus:outline-hidden focus:border-blue-500"
                  />
                  <input
                    type="email"
                    placeholder="Email Address"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    className="bg-slate-900 text-slate-100 text-xs px-3 py-2 rounded-xl border border-slate-700 focus:outline-hidden focus:border-blue-500"
                  />
                  <input
                    type="tel"
                    placeholder="Phone Number (e.g. +91 9876543210)"
                    value={newPhone}
                    onChange={(e) => setNewPhone(e.target.value)}
                    className="bg-slate-900 text-slate-100 text-xs px-3 py-2 rounded-xl border border-slate-700 focus:outline-hidden focus:border-blue-500"
                  />
                </div>
                <div className="flex justify-end gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setShowAddForm(false)}
                    className="px-3 py-1.5 text-xs text-slate-400 hover:text-slate-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting || !newGivenName.trim()}
                    className="px-4 py-1.5 text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white rounded-xl disabled:opacity-50 cursor-pointer"
                  >
                    {isSubmitting ? 'Saving to Google...' : 'Save to Google Contacts'}
                  </button>
                </div>
              </form>
            )}

            {/* Contacts List Body */}
            <div className="flex-1 overflow-y-auto p-4 space-y-2.5">
              {loading ? (
                <div className="py-16 text-center space-y-3">
                  <RefreshCw className="w-8 h-8 text-blue-400 animate-spin mx-auto" />
                  <p className="text-xs font-semibold text-slate-300">Loading your Google Contacts...</p>
                </div>
              ) : error ? (
                <div className="p-6 bg-red-950/30 border border-red-500/30 rounded-2xl text-center space-y-3">
                  <AlertCircle className="w-8 h-8 text-red-400 mx-auto" />
                  <p className="text-xs font-semibold text-red-300">{error}</p>
                  <button
                    onClick={loadContacts}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold cursor-pointer"
                  >
                    Retry Authorization
                  </button>
                </div>
              ) : filteredContacts.length === 0 ? (
                <div className="py-16 text-center space-y-2">
                  <Users className="w-8 h-8 text-slate-600 mx-auto" />
                  <p className="text-xs font-semibold text-slate-400">
                    {searchQuery ? 'No contacts matched your search' : 'No contacts found in your Google Account'}
                  </p>
                  <p className="text-[11px] text-slate-500">
                    Click "+ Add Contact" above to add your first friend.
                  </p>
                </div>
              ) : (
                filteredContacts.map((contact) => (
                  <div
                    key={contact.resourceName}
                    className="flex items-center justify-between p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 hover:border-slate-700 transition-all gap-3"
                  >
                    {/* Contact Avatar & Info */}
                    <div className="flex items-center gap-3 min-w-0">
                      {contact.photoUrl ? (
                        <img
                          src={contact.photoUrl}
                          alt={contact.name}
                          referrerPolicy="no-referrer"
                          className="w-10 h-10 rounded-full object-cover border border-slate-700 shrink-0"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-slate-800 to-slate-700 border border-slate-600 flex items-center justify-center font-bold text-xs text-slate-200 shrink-0">
                          {contact.name.charAt(0).toUpperCase()}
                        </div>
                      )}

                      <div className="min-w-0">
                        <h4 className="text-xs font-bold text-slate-100 truncate">{contact.name}</h4>
                        <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 text-[11px] text-slate-400 mt-0.5">
                          {contact.phone && (
                            <span className="flex items-center gap-1">
                              <Phone className="w-3 h-3 text-emerald-400" />
                              {contact.phone}
                            </span>
                          )}
                          {contact.email && (
                            <span className="flex items-center gap-1 truncate max-w-[180px]">
                              <Mail className="w-3 h-3 text-blue-400" />
                              {contact.email}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Actions: WhatsApp, Email, Copy Invite, Delete */}
                    <div className="flex items-center gap-1.5 shrink-0">
                      {contact.phone && (
                        <button
                          onClick={() => handleShareViaWhatsApp(contact)}
                          className="p-2 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 transition-colors cursor-pointer"
                          title="Send Invite on WhatsApp"
                        >
                          <Send className="w-3.5 h-3.5" />
                        </button>
                      )}

                      {contact.email && (
                        <button
                          onClick={() => handleShareViaEmail(contact)}
                          className="p-2 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border border-blue-500/20 transition-colors cursor-pointer"
                          title="Send Invite via Email"
                        >
                          <Mail className="w-3.5 h-3.5" />
                        </button>
                      )}

                      <button
                        onClick={() => handleCopyInvite(contact)}
                        className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors cursor-pointer"
                        title="Copy Invite Link"
                      >
                        {copiedId === contact.resourceName ? (
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>

                      <button
                        onClick={() => setDeleteCandidate(contact)}
                        className="p-2 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer"
                        title="Delete Contact"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </>
        )}

        {/* Confirmation Modal for Deletion (Mandatory for mutating/destructive operations) */}
        {deleteCandidate && (
          <div className="absolute inset-0 bg-slate-950/90 z-20 flex items-center justify-center p-6 animate-fade-in">
            <div className="bg-slate-900 border border-red-500/40 p-6 rounded-2xl max-w-md w-full text-center space-y-4 shadow-2xl">
              <div className="w-12 h-12 rounded-full bg-red-500/10 text-red-400 flex items-center justify-center mx-auto border border-red-500/20">
                <Trash2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-100">
                  Delete Contact from Google Account?
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Are you sure you want to permanently delete <strong className="text-slate-200">{deleteCandidate.name}</strong> from your Google Contacts? This action cannot be undone.
                </p>
              </div>
              <div className="flex gap-3 justify-center pt-2">
                <button
                  onClick={() => setDeleteCandidate(null)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDeleteContact}
                  className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold cursor-pointer"
                >
                  Confirm Delete
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal Footer */}
        <div className="px-6 py-3 border-t border-slate-800 bg-slate-950/60 flex items-center justify-between text-xs text-slate-400">
          <span>{isConnected ? `${filteredContacts.length} Contacts Found` : 'Not Connected'}</span>
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
