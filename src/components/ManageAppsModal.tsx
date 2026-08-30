import React, { useState } from 'react';
import { YonoApp } from '../types';
import { 
  X, 
  Plus, 
  Edit3, 
  Trash2, 
  Download, 
  Upload, 
  RotateCcw, 
  Search, 
  Sparkles, 
  Check, 
  FileJson,
  Layers,
  CheckCircle2,
  ExternalLink,
  Pin
} from 'lucide-react';
import { AppIcon } from './AppIcon';

interface ManageAppsModalProps {
  isOpen: boolean;
  onClose: () => void;
  apps: YonoApp[];
  onAddNewApp: () => void;
  onEditApp: (app: YonoApp) => void;
  onDeleteApp: (appId: string) => void;
  onTogglePinToBottom?: (appId: string) => void;
  onResetDefaultApps: () => void;
  onImportApps: (importedApps: YonoApp[]) => void;
}

export const ManageAppsModal: React.FC<ManageAppsModalProps> = ({
  isOpen,
  onClose,
  apps,
  onAddNewApp,
  onEditApp,
  onDeleteApp,
  onTogglePinToBottom,
  onResetDefaultApps,
  onImportApps
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [exportSuccess, setExportSuccess] = useState(false);

  if (!isOpen) return null;

  const filtered = apps.filter((app) =>
    app.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    app.tagline.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleExportJson = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(apps, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `yono_apps_backup_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    setExportSuccess(true);
    setTimeout(() => setExportSuccess(false), 2500);
  };

  const handleImportJson = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const parsed = JSON.parse(event.target?.result as string);
          if (Array.isArray(parsed) && parsed.length > 0 && parsed[0].name) {
            onImportApps(parsed);
            alert(`Successfully imported ${parsed.length} apps!`);
          } else {
            alert('Invalid JSON backup file format.');
          }
        } catch (err) {
          alert('Error parsing JSON file. Please ensure it is a valid backup.');
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <div id="manage-apps-modal-overlay" className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
      <div 
        id="manage-apps-modal-card"
        className="relative w-full max-w-3xl rounded-3xl bg-slate-900 border border-slate-700 shadow-2xl p-5 sm:p-7 text-slate-100 my-6 max-h-[90vh] flex flex-col"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center">
              <Layers className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-black text-white font-['Outfit',sans-serif]">
                App Manager & Customizer (ऐप्स मैनेजर)
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Total {apps.length} Yono games in your catalog • Add, edit images, or delete any app
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              onClose();
              onAddNewApp();
            }}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-slate-950 font-black text-xs sm:text-sm shadow-md transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>+ Add New App (नया ऐप जोड़ें)</span>
          </button>
        </div>

        {/* Search & Bulk Action Toolbar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 py-3 shrink-0">
          <div className="relative flex-1">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search apps by name..."
              className="w-full bg-slate-950 text-slate-100 text-xs pl-8 pr-3 py-2 rounded-xl border border-slate-700 focus:outline-hidden focus:border-amber-400"
            />
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5 pointer-events-none" />
          </div>

          <div className="flex items-center gap-2">
            {/* Export Backup JSON */}
            <button
              onClick={handleExportJson}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-colors cursor-pointer"
              title="Download JSON Backup"
            >
              {exportSuccess ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <FileJson className="w-3.5 h-3.5 text-amber-400" />}
              <span>{exportSuccess ? 'Exported!' : 'Backup JSON'}</span>
            </button>

            {/* Import Backup JSON */}
            <label className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-colors cursor-pointer">
              <Upload className="w-3.5 h-3.5 text-sky-400" />
              <span>Import</span>
              <input
                type="file"
                accept=".json"
                onChange={handleImportJson}
                className="hidden"
              />
            </label>

            {/* Reset to Factory Defaults */}
            <button
              onClick={() => {
                if (window.confirm('Reset all apps to original default list? Any custom added apps will be reset.')) {
                  onResetDefaultApps();
                }
              }}
              className="flex items-center gap-1 px-2.5 py-2 rounded-xl bg-slate-800 hover:bg-rose-500/20 text-slate-400 hover:text-rose-300 text-xs transition-colors cursor-pointer"
              title="Reset to official apps"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Reset</span>
            </button>
          </div>
        </div>

        {/* App List Container */}
        <div className="flex-1 overflow-y-auto space-y-2.5 pr-1 min-h-[300px]">
          {filtered.length === 0 ? (
            <div className="text-center py-12 text-slate-500 text-xs">
              No apps found matching "{searchTerm}".
            </div>
          ) : (
            filtered.map((app, index) => (
              <div
                key={app.id}
                className="flex items-center justify-between gap-3 p-3 rounded-2xl bg-slate-950/70 border border-slate-800 hover:border-slate-700 transition-all"
              >
                {/* App Info & Icon */}
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <span className="text-xs font-mono text-slate-500 w-5 text-center">
                    {index + 1}
                  </span>
                  
                  <AppIcon app={app} sizeClassName="w-11 h-11" textClassName="text-base" />

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-white truncate font-['Outfit',sans-serif]">
                        {app.name}
                      </h4>
                      {app.badge && (
                        <span className="text-[9px] font-black px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                          {app.badge}
                        </span>
                      )}
                      {app.imageUrl && (
                        <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300">
                          Custom Image
                        </span>
                      )}
                      {app.pinToBottom && (
                        <span className="text-[9px] font-black px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40 inline-flex items-center gap-0.5">
                          <Pin className="w-2.5 h-2.5 rotate-45" />
                          <span>Pinned Bottom</span>
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-0.5">
                      <span className="text-amber-400 font-bold font-mono">Bonus ₹{app.signupBonus}</span>
                      <span>•</span>
                      <span className="text-emerald-400 font-mono">Min W/D ₹{app.minWithdrawal}</span>
                      <span>•</span>
                      <span>{app.apkSize}</span>
                    </div>
                  </div>
                </div>

                {/* Edit & Delete Action Buttons */}
                <div className="flex items-center gap-1.5 shrink-0">
                  {onTogglePinToBottom && (
                    <button
                      onClick={() => onTogglePinToBottom(app.id)}
                      className={`p-1.5 rounded-xl transition-all cursor-pointer ${
                        app.pinToBottom
                          ? 'bg-amber-500 text-slate-950 font-bold'
                          : 'bg-slate-800 text-slate-400 hover:text-amber-300 hover:bg-slate-700'
                      }`}
                      title={app.pinToBottom ? 'Unpin from Bottom' : 'Pin to Bottom (SEO)'}
                    >
                      <Pin className={`w-3.5 h-3.5 ${app.pinToBottom ? 'rotate-45 fill-slate-950' : 'rotate-45'}`} />
                    </button>
                  )}

                  <button
                    onClick={() => {
                      onClose();
                      onEditApp(app);
                    }}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-amber-500 hover:text-slate-950 text-slate-200 text-xs font-bold transition-colors cursor-pointer"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Edit (बदलें)</span>
                  </button>

                  <button
                    onClick={() => {
                      if (window.confirm(`Delete "${app.name}" from your apps list?`)) {
                        onDeleteApp(app.id);
                      }
                    }}
                    className="p-1.5 rounded-xl bg-slate-800/80 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 transition-colors cursor-pointer"
                    title="Delete App"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="pt-4 mt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400 shrink-0">
          <span>
            💾 All changes are saved automatically in your browser.
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
