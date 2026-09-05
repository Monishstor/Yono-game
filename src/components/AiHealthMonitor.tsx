import React, { useState, useEffect } from 'react';
import { YonoApp, SiteSettings, PromoCode } from '../types';
import { HealthEngine, HealthReport, HealthIssue } from '../lib/healthEngine';
import { 
  ShieldCheck, 
  RefreshCw, 
  Wrench, 
  Copy, 
  Check, 
  AlertTriangle, 
  AlertCircle, 
  Info, 
  CheckCircle2, 
  Search, 
  ExternalLink,
  Bot,
  Activity,
  Zap,
  Trash2,
  Sliders,
  Globe
} from 'lucide-react';
import { AppIcon } from './AppIcon';

interface AiHealthMonitorProps {
  apps: YonoApp[];
  siteSettings: SiteSettings;
  promoCodes: PromoCode[];
  onUpdateApps: (updatedApps: YonoApp[]) => void;
  onEditApp: (app: YonoApp) => void;
}

export const AiHealthMonitor: React.FC<AiHealthMonitorProps> = ({
  apps,
  siteSettings,
  promoCodes,
  onUpdateApps,
  onEditApp
}) => {
  const [report, setReport] = useState<HealthReport>(() => 
    HealthEngine.scanSystemHealth(apps, siteSettings, promoCodes)
  );
  const [isScanning, setIsScanning] = useState(false);
  const [copiedPrompt, setCopiedPrompt] = useState(false);
  const [autoHealFeedback, setAutoHealFeedback] = useState<string | null>(null);
  const [filterSeverity, setFilterSeverity] = useState<'all' | 'critical' | 'warning' | 'info'>('all');
  const [appSearch, setAppSearch] = useState('');

  // Re-scan when inputs change
  const handleRunScan = () => {
    setIsScanning(true);
    setTimeout(() => {
      const newReport = HealthEngine.scanSystemHealth(apps, siteSettings, promoCodes);
      setReport(newReport);
      setIsScanning(false);
    }, 400);
  };

  useEffect(() => {
    handleRunScan();
  }, [apps.length, promoCodes.length]);

  // 1-Click Auto-Heal All
  const handleAutoHealAll = () => {
    const { healedApps, totalFixed, summary } = HealthEngine.autoHealAllApps(apps);
    if (totalFixed > 0) {
      onUpdateApps(healedApps);
      setAutoHealFeedback(`✅ Successfully auto-healed ${totalFixed} issues across ${healedApps.length} games!`);
      handleRunScan();
    } else {
      setAutoHealFeedback(`✨ Sabhi ${apps.length} apps pehle se 100% healthy hain!`);
    }

    setTimeout(() => {
      setAutoHealFeedback(null);
    }, 5000);
  };

  // Auto-heal single app
  const handleHealSingleApp = (app: YonoApp) => {
    const { healedApp, changes } = HealthEngine.autoHealApp(app);
    const updated = apps.map(a => a.id === app.id ? healedApp : a);
    onUpdateApps(updated);
    setAutoHealFeedback(`✅ ${healedApp.name} fixed: ${changes.join(', ') || 'Optimized'}`);
    handleRunScan();
    setTimeout(() => setAutoHealFeedback(null), 4000);
  };

  // Copy AI Prompt
  const handleCopyAiPrompt = () => {
    navigator.clipboard.writeText(report.aiPromptSummary).then(() => {
      setCopiedPrompt(true);
      setTimeout(() => setCopiedPrompt(false), 3000);
    });
  };

  // Clear runtime console logs
  const handleClearRuntimeLogs = () => {
    HealthEngine.clearRuntimeErrors();
    handleRunScan();
  };

  const filteredIssues = report.issues.filter(issue => {
    if (filterSeverity === 'all') return true;
    return issue.severity === filterSeverity;
  });

  return (
    <div id="ai-health-monitor-tab" className="space-y-6">
      
      {/* Header Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900 to-indigo-950/60 border border-indigo-500/30 p-5 sm:p-6 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400 shrink-0 shadow-lg">
              <Bot className="w-8 h-8" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-extrabold uppercase tracking-wider border border-emerald-500/30 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  AI Self-Healing Active
                </span>
                <span className="text-xs text-slate-400 font-mono">Last Scan: {report.lastScannedAt}</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-white font-['Outfit',sans-serif] mt-1">
                AI Auto-Diagnostic & Card Health Engine
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 mt-0.5">
                Saare {apps.length}+ games, download links, images, layout aur runtime code ko live scan karke auto-repair karta hai.
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            
            <button
              onClick={handleRunScan}
              disabled={isScanning}
              className="py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold flex items-center gap-2 transition-all cursor-pointer shadow-sm active:scale-95 disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 text-indigo-400 ${isScanning ? 'animate-spin' : ''}`} />
              <span>{isScanning ? 'Scanning...' : 'Run Live Scan'}</span>
            </button>

            <button
              onClick={handleAutoHealAll}
              className="py-2.5 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white text-xs font-black flex items-center gap-2 transition-all cursor-pointer shadow-lg shadow-emerald-500/20 active:scale-95"
            >
              <Zap className="w-4 h-4" />
              <span>Auto-Heal All ({report.issuesCount} Items)</span>
            </button>

            <button
              onClick={handleCopyAiPrompt}
              className="py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 text-xs font-black flex items-center gap-2 transition-all cursor-pointer shadow-lg shadow-amber-500/20 active:scale-95"
            >
              {copiedPrompt ? (
                <>
                  <Check className="w-4 h-4 text-slate-950 font-bold" />
                  <span>AI Prompt Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 text-slate-950 font-bold" />
                  <span>Copy AI Fix Report</span>
                </>
              )}
            </button>

          </div>
        </div>

        {/* Feedback Alert Toast */}
        {autoHealFeedback && (
          <div className="mt-4 p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center gap-2 animate-fadeIn">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{autoHealFeedback}</span>
          </div>
        )}
      </div>

      {/* STATS OVERVIEW CARDS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
        
        {/* Health Score */}
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 shadow-md">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span className="font-semibold">Health Score</span>
            <Activity className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className={`text-2xl sm:text-3xl font-black font-['Outfit',sans-serif] ${
              report.overallScore >= 90 ? 'text-emerald-400' :
              report.overallScore >= 75 ? 'text-amber-400' : 'text-rose-400'
            }`}>
              {report.overallScore}%
            </span>
            <span className="text-[11px] font-bold text-slate-400 uppercase">
              {report.status.toUpperCase()}
            </span>
          </div>
          <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
            <div 
              className={`h-full transition-all duration-500 ${
                report.overallScore >= 90 ? 'bg-emerald-400' :
                report.overallScore >= 75 ? 'bg-amber-400' : 'bg-rose-400'
              }`}
              style={{ width: `${report.overallScore}%` }}
            ></div>
          </div>
        </div>

        {/* Total Apps Checked */}
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 shadow-md">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span className="font-semibold">Apps Scanned</span>
            <ShieldCheck className="w-4 h-4 text-sky-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white font-['Outfit',sans-serif]">
            {report.totalAppsScanned}
          </div>
          <div className="text-[11px] text-emerald-400 font-semibold mt-1">
            {report.healthyAppsCount} Cards 100% Perfect
          </div>
        </div>

        {/* Auto-Healed Items */}
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 shadow-md">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span className="font-semibold">Auto-Guarded</span>
            <Zap className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-emerald-400 font-['Outfit',sans-serif]">
            {report.autoHealedCount}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            Fallbacks & Safe Handlers Active
          </div>
        </div>

        {/* Pending / Attention Items */}
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 shadow-md">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span className="font-semibold">Open Diagnostics</span>
            <AlertTriangle className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-amber-400 font-['Outfit',sans-serif]">
            {report.issuesCount}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            {report.issues.filter(i => i.severity === 'critical').length} Critical • {report.issues.filter(i => i.severity === 'warning').length} Warnings
          </div>
        </div>

      </div>

      {/* DIAGNOSTIC ISSUE LOGS */}
      <div className="rounded-2xl bg-slate-900 border border-slate-800 p-5 sm:p-6 space-y-4">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-slate-800">
          <div>
            <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-indigo-400" />
              <span>Live Diagnostic Logs & Recommendations</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Detected errors, missing download links, and formatting inconsistencies:
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800 self-start">
            <button
              onClick={() => setFilterSeverity('all')}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                filterSeverity === 'all' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              All ({report.issues.length})
            </button>
            <button
              onClick={() => setFilterSeverity('critical')}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                filterSeverity === 'critical' ? 'bg-rose-600 text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Critical ({report.issues.filter(i => i.severity === 'critical').length})
            </button>
            <button
              onClick={() => setFilterSeverity('warning')}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                filterSeverity === 'warning' ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Warnings ({report.issues.filter(i => i.severity === 'warning').length})
            </button>
            <button
              onClick={() => setFilterSeverity('info')}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                filterSeverity === 'info' ? 'bg-sky-600 text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Info ({report.issues.filter(i => i.severity === 'info').length})
            </button>
          </div>
        </div>

        {/* Issue Items List */}
        {filteredIssues.length === 0 ? (
          <div className="py-12 text-center space-y-3">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <div className="text-white font-bold text-base">Sabhi Cards 100% Healthy Hain!</div>
            <p className="text-xs text-slate-400 max-w-md mx-auto">
              Is filter me koi bhi issue nahi mila. Saari APKs, download buttons aur images smoothly run kar rahi hain.
            </p>
          </div>
        ) : (
          <div className="space-y-3 max-h-[450px] overflow-y-auto pr-1">
            {filteredIssues.map((issue) => {
              const targetApp = issue.appId ? apps.find(a => a.id === issue.appId) : null;

              return (
                <div
                  key={issue.id}
                  className={`p-3.5 sm:p-4 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all ${
                    issue.severity === 'critical' 
                      ? 'bg-rose-950/20 border-rose-500/40 text-rose-200' :
                    issue.severity === 'warning'
                      ? 'bg-amber-950/20 border-amber-500/40 text-amber-200' :
                      'bg-sky-950/20 border-sky-500/30 text-sky-200'
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider ${
                        issue.severity === 'critical' ? 'bg-rose-500 text-white' :
                        issue.severity === 'warning' ? 'bg-amber-500 text-slate-950' :
                        'bg-sky-500 text-slate-950'
                      }`}>
                        {issue.severity}
                      </span>
                      <span className="text-xs font-bold text-white">{issue.appName || 'System Config'}</span>
                      <span className="text-[10px] text-slate-400">({issue.category})</span>
                      {issue.autoHealed && (
                        <span className="px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-400 text-[10px] font-bold border border-emerald-500/30">
                          Auto-Guarded
                        </span>
                      )}
                    </div>
                    <div className="text-sm font-semibold text-white">{issue.message}</div>
                    <div className="text-xs text-slate-400">{issue.details}</div>
                    <div className="text-[11px] text-indigo-300 font-medium">
                      💡 <strong>Fix:</strong> {issue.recommendation}
                    </div>
                  </div>

                  {/* Quick Fix Button */}
                  <div className="flex items-center gap-2 shrink-0">
                    {targetApp && (
                      <>
                        <button
                          onClick={() => handleHealSingleApp(targetApp)}
                          className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-sm active:scale-95"
                          title="Auto-repair card"
                        >
                          <Wrench className="w-3.5 h-3.5" />
                          <span>Auto-Fix</span>
                        </button>
                        <button
                          onClick={() => onEditApp(targetApp)}
                          className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1 cursor-pointer border border-slate-700"
                        >
                          <span>Edit</span>
                        </button>
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>

      {/* ALL APPS HEALTH INSPECTOR */}
      <div className="rounded-2xl bg-slate-900 border border-slate-800 p-5 sm:p-6 space-y-4">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-slate-800">
          <div>
            <h3 className="text-base sm:text-lg font-bold text-white">
              Individual Card Inspector ({apps.length} Games)
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Live inspection of download links, images, VIP bonuses, and UPI cashouts for every card.
            </p>
          </div>

          <div className="relative w-full sm:w-64">
            <input
              type="text"
              value={appSearch}
              onChange={(e) => setAppSearch(e.target.value)}
              placeholder="Search by game name..."
              className="w-full bg-slate-950 text-slate-100 placeholder-slate-500 text-xs pl-8 pr-3 py-2 rounded-xl border border-slate-700 focus:outline-hidden focus:border-indigo-400"
            />
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5 pointer-events-none" />
          </div>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 max-h-[500px] overflow-y-auto pr-1">
          {apps
            .filter(app => !appSearch || app.name.toLowerCase().includes(appSearch.toLowerCase()) || app.id.toLowerCase().includes(appSearch.toLowerCase()))
            .map((app) => {
              const appIssues = report.issues.filter(i => i.appId === app.id);
              const isHealthy = appIssues.length === 0;

              return (
                <div
                  key={app.id}
                  className={`p-3.5 rounded-xl border flex items-center justify-between gap-3 ${
                    isHealthy
                      ? 'bg-slate-950/60 border-slate-800'
                      : 'bg-amber-950/15 border-amber-500/40'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <AppIcon app={app} sizeClassName="w-10 h-10" textClassName="text-base" />
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-white truncate">{app.name}</div>
                      <div className="text-[10px] text-slate-400 flex items-center gap-1.5 mt-0.5">
                        <span className="text-amber-400 font-semibold">₹{app.signupBonus} Bonus</span>
                        <span>•</span>
                        <span className="text-emerald-400">Min ₹{app.minWithdrawal}</span>
                      </div>
                      <div className="text-[10px] text-slate-500 truncate mt-0.5">
                        DL: {app.downloadUrl || 'Default fallback'}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    {isHealthy ? (
                      <span className="px-2 py-1 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-[10px] font-bold flex items-center gap-1">
                        <Check className="w-3 h-3" />
                        <span>Pass</span>
                      </span>
                    ) : (
                      <button
                        onClick={() => handleHealSingleApp(app)}
                        className="px-2 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 text-[10px] font-bold flex items-center gap-1 cursor-pointer"
                        title="Auto-Fix this card"
                      >
                        <Wrench className="w-3 h-3" />
                        <span>Fix</span>
                      </button>
                    )}
                    <button
                      onClick={() => onEditApp(app)}
                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs cursor-pointer border border-slate-700"
                      title="Edit Card"
                    >
                      <Sliders className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
        </div>

      </div>

      {/* AI PROMPT BOX READY FOR CHAT */}
      <div className="rounded-2xl bg-slate-900 border border-indigo-500/30 p-5 sm:p-6 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bot className="w-5 h-5 text-amber-400" />
            <h3 className="text-sm sm:text-base font-bold text-white">
              AI Chat Prompt for Permanent Code Fixing (1-क्लिक कॉपी करें)
            </h3>
          </div>
          <button
            onClick={handleCopyAiPrompt}
            className="py-1.5 px-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black flex items-center gap-1.5 cursor-pointer shadow-md"
          >
            {copiedPrompt ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedPrompt ? 'Copied!' : 'Copy Prompt'}</span>
          </button>
        </div>

        <p className="text-xs text-slate-400">
          Agar aapko website ke kisi card ya code me permanent change karwana ho, toh neeche diya gaya prompt ek click me copy karke seedha AI chat me paste kar dein:
        </p>

        <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs text-slate-300 whitespace-pre-wrap max-h-40 overflow-y-auto">
          {report.aiPromptSummary}
        </div>
      </div>

    </div>
  );
};
