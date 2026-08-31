import React, { useState } from 'react';
import { 
  X, 
  Mail, 
  Send, 
  ShieldCheck, 
  HelpCircle, 
  FileText, 
  AlertCircle, 
  MessageSquare, 
  CheckCircle2, 
  ExternalLink 
} from 'lucide-react';

export type LegalTabType = 'contact' | 'about' | 'privacy' | 'terms' | 'dmca' | 'disclaimer';

interface ContactLegalModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: LegalTabType;
  telegramLink?: string;
}

export const ContactLegalModal: React.FC<ContactLegalModalProps> = ({
  isOpen,
  onClose,
  initialTab = 'contact',
  telegramLink = 'https://t.me/yonojiunauxcom'
}) => {
  const [activeTab, setActiveTab] = useState<LegalTabType>(initialTab);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: 'APK Download / Bonus Issue',
    message: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;
    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      setFormData({ name: '', email: '', subject: 'APK Download / Bonus Issue', message: '' });
      onClose();
    }, 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div 
        className="relative w-full max-w-3xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl shadow-black/80 overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              {activeTab === 'contact' && <Mail className="w-5 h-5" />}
              {activeTab === 'about' && <HelpCircle className="w-5 h-5" />}
              {activeTab === 'privacy' && <ShieldCheck className="w-5 h-5" />}
              {activeTab === 'terms' && <FileText className="w-5 h-5" />}
              {activeTab === 'dmca' && <AlertCircle className="w-5 h-5" />}
              {activeTab === 'disclaimer' && <AlertCircle className="w-5 h-5" />}
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black text-white capitalize">
                {activeTab === 'contact' && 'Contact Support & Helpdesk'}
                {activeTab === 'about' && 'About All New Yono Games'}
                {activeTab === 'privacy' && 'Privacy Policy'}
                {activeTab === 'terms' && 'Terms of Service & Rules'}
                {activeTab === 'dmca' && 'DMCA Copyright Notice'}
                {activeTab === 'disclaimer' && 'Responsible Gaming & Risk Disclaimer'}
              </h2>
              <p className="text-xs text-slate-400">
                Official Information & User Support Portal
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-800 bg-slate-950/40 overflow-x-auto text-xs font-bold scrollbar-none">
          {[
            { id: 'contact', label: 'Contact Us', icon: Mail },
            { id: 'about', label: 'About Us', icon: HelpCircle },
            { id: 'privacy', label: 'Privacy Policy', icon: ShieldCheck },
            { id: 'terms', label: 'Terms', icon: FileText },
            { id: 'dmca', label: 'DMCA', icon: AlertCircle },
            { id: 'disclaimer', label: 'Risk Disclaimer', icon: AlertCircle },
          ].map((tab) => {
            const Icon = tab.icon;
            const isCurrent = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as LegalTabType)}
                className={`flex items-center gap-1.5 px-4 py-3 border-b-2 whitespace-nowrap transition-all cursor-pointer ${
                  isCurrent
                    ? 'border-amber-400 text-amber-400 bg-amber-500/10'
                    : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Modal Content Body */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1 text-xs sm:text-sm text-slate-300 space-y-4 leading-relaxed">
          
          {/* TAB 1: CONTACT US */}
          {activeTab === 'contact' && (
            <div className="space-y-5">
              <div className="p-4 rounded-xl bg-gradient-to-r from-amber-500/10 via-emerald-500/10 to-transparent border border-amber-500/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="font-bold text-white flex items-center gap-2">
                    <Send className="w-4 h-4 text-sky-400" />
                    <span>Instant Telegram Helpdesk (24/7 Live Support)</span>
                  </div>
                  <p className="text-xs text-slate-400">
                    Get quick responses for APK download links, referral bonuses, or verification issues.
                  </p>
                </div>
                <a
                  href={telegramLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-black text-xs flex items-center gap-1.5 shrink-0 shadow-md transition-transform active:scale-95"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Join Official Telegram</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>

              {isSubmitted ? (
                <div className="p-8 text-center rounded-xl bg-emerald-500/10 border border-emerald-500/30 space-y-2">
                  <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
                  <h3 className="text-base font-bold text-white">Message Sent Successfully!</h3>
                  <p className="text-xs text-slate-300">
                    Our support team will review your inquiry and get back to you within 24 hours.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-3.5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-1">
                        Your Name (आपका नाम) *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Rahul Sharma"
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-hidden focus:border-amber-400"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-1">
                        Email Address (ईमेल) *
                      </label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="you@example.com"
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-hidden focus:border-amber-400"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">
                      Inquiry Topic (विषय)
                    </label>
                    <select
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-hidden focus:border-amber-400"
                    >
                      <option value="APK Download / Bonus Issue">APK Download / Bonus Issue</option>
                      <option value="Game Link Not Working">Game Link Not Working</option>
                      <option value="Referral Code Query">Referral Code Query</option>
                      <option value="Business / Promotion Collaboration">Business / Promotion Collaboration</option>
                      <option value="DMCA or Content Removal">DMCA or Content Removal</option>
                      <option value="Other Question">Other Question</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">
                      Your Message (संदेश) *
                    </label>
                    <textarea
                      required
                      rows={4}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Write your issue or inquiry here..."
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3.5 text-xs text-white placeholder-slate-500 focus:outline-hidden focus:border-amber-400 resize-none"
                    />
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={onClose}
                      className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-slate-950 font-black text-xs flex items-center gap-1.5 shadow-md cursor-pointer transition-transform active:scale-95"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>Send Message (संदेश भेजें)</span>
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}

          {/* TAB 2: ABOUT US */}
          {activeTab === 'about' && (
            <div className="space-y-3">
              <h3 className="text-base font-bold text-white">About All New Yono Games & APK Portal</h3>
              <p>
                <strong>All New Yono Games</strong> is an independent online catalog and directory dedicated to providing verified download links, real-money bonus guides, promo codes, and technical installation assistance for skill-based gaming applications (Rummy, Ludo, Poker, and Casual Games) across India.
              </p>
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
                <div className="text-amber-400 font-bold text-xs">Our Mission & Standards:</div>
                <ul className="list-disc list-inside space-y-1 text-slate-400 text-xs">
                  <li>100% Virus-Free & Tested APK files verified on Android 13, 14 & 15.</li>
                  <li>Real verified signup bonuses ranging from ₹5 to ₹1500 with clear terms.</li>
                  <li>Fast 1-3 minute UPI withdrawal speed comparisons.</li>
                  <li>Daily active promo codes and mystery bonus links.</li>
                </ul>
              </div>
              <p className="text-slate-400 text-xs">
                <em>Notice:</em> We are an independent gaming review and indexing platform. We are NOT associated with any banking institution or government financial service.
              </p>
            </div>
          )}

          {/* TAB 3: PRIVACY POLICY */}
          {activeTab === 'privacy' && (
            <div className="space-y-3 text-slate-300">
              <h3 className="text-base font-bold text-white">Privacy Policy</h3>
              <p>
                Your privacy is of the utmost importance to us. This Privacy Policy details how we handle non-personal information when you access our portal.
              </p>
              <div className="space-y-2">
                <h4 className="font-bold text-white text-xs">1. Information Collection</h4>
                <p className="text-xs text-slate-400">
                  We do not collect personal banking details, passwords, or government IDs. Any client-side preferences (such as favorite games or daily check-in streaks) are stored locally in your browser's LocalStorage.
                </p>
                <h4 className="font-bold text-white text-xs">2. Third-Party Links & APK Files</h4>
                <p className="text-xs text-slate-400">
                  Our website contains outbound download links to official game servers. When you click download, you may be redirected to the respective developer's official CDN. Please review their independent privacy terms.
                </p>
                <h4 className="font-bold text-white text-xs">3. Cookies & Analytics</h4>
                <p className="text-xs text-slate-400">
                  We use standard lightweight cookies to ensure smooth site navigation, filter persistence, and Google Search Console performance analytics.
                </p>
              </div>
            </div>
          )}

          {/* TAB 4: TERMS OF SERVICE */}
          {activeTab === 'terms' && (
            <div className="space-y-3">
              <h3 className="text-base font-bold text-white">Terms of Service</h3>
              <ul className="list-disc list-inside space-y-2 text-slate-300 text-xs leading-relaxed">
                <li><strong>Age Restriction (18+ Only):</strong> You must be at least 18 years old to access and download any skill-based cash gaming applications indexed on this website.</li>
                <li><strong>Geographical Limitations:</strong> Real-money online gaming may be prohibited in certain states of India, including Assam, Odisha, Andhra Pradesh, Telangana, Sikkim, and Nagaland. Users residing in restricted states must comply with local laws.</li>
                <li><strong>Informational Nature:</strong> All content, ratings, and bonus guides are for educational and informational purposes only. We do not host game servers or conduct wagering.</li>
              </ul>
            </div>
          )}

          {/* TAB 5: DMCA NOTICE */}
          {activeTab === 'dmca' && (
            <div className="space-y-3">
              <h3 className="text-base font-bold text-white">DMCA & Copyright Policy</h3>
              <p>
                We respect the intellectual property rights of app developers and copyright owners. All game logos, trademarks, and brand names belong to their respective creators.
              </p>
              <p className="text-xs text-slate-400">
                If you are a copyright owner or authorized representative and believe that any content or APK link on this site infringes upon your copyright, please contact us at <strong>support@allnewyonoapps.com</strong> or via our Contact tab with proof of ownership, and we will take down the requested content within 24–48 hours.
              </p>
            </div>
          )}

          {/* TAB 6: RISK DISCLAIMER */}
          {activeTab === 'disclaimer' && (
            <div className="space-y-3">
              <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 font-bold text-xs flex items-center gap-2">
                <AlertCircle className="w-5 h-5 shrink-0" />
                <span>Statutory Financial Risk & Addiction Warning</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Playing real-money skill games (such as Rummy, Poker, or Casual Slots) involves an element of financial risk and may become habit-forming. Please play responsibly and within your financial limits.
              </p>
              <p className="text-xs text-slate-400">
                Never gamble with money you cannot afford to lose. If you feel you are developing a gaming problem, please seek guidance from professional helplines or self-exclude from gaming apps.
              </p>
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="p-3.5 sm:p-4 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between text-xs text-slate-400">
          <span>Need help? Contact: <a href={telegramLink} target="_blank" rel="noopener noreferrer" className="text-amber-400 font-bold hover:underline">Official Telegram Channel</a></span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-bold cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
