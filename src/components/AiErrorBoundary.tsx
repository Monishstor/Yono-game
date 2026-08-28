import React from 'react';
import { HealthEngine } from '../lib/healthEngine';
import { RefreshCw, Wrench, Copy, Check, ShieldAlert } from 'lucide-react';

interface Props {
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
  copiedPrompt: boolean;
}

export class AiErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      copiedPrompt: false
    };
  }

  public static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('AI Error Boundary caught an error:', error, errorInfo);
    HealthEngine.logError(error, errorInfo);
    this.setState({ errorInfo });
  }

  private handleAutoRecover = () => {
    // Clear corrupted temporary sessions if any
    this.setState({ hasError: false, error: null, errorInfo: null });
    window.location.hash = '#/';
  };

  private handleFullReset = () => {
    if (window.confirm('Kya aap site ko fresh restart karna chahte hain?')) {
      window.location.href = window.location.origin + window.location.pathname;
    }
  };

  private handleCopyAiReport = () => {
    const errorText = `Bhai, website me ek component crash hua hai jise theek karna hai:
🚨 Error: ${this.state.error?.message || 'Unknown render error'}
📍 Stack trace:
${this.state.errorInfo?.componentStack || this.state.error?.stack || 'No stack'}

Kripya is code ko check karke turant theek kar do.`;

    navigator.clipboard.writeText(errorText).then(() => {
      this.setState({ copiedPrompt: true });
      setTimeout(() => this.setState({ copiedPrompt: false }), 3000);
    });
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4 font-['Plus_Jakarta_Sans',sans-serif]">
          <div className="max-w-lg w-full bg-slate-900 border border-amber-500/40 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-black space-y-6 text-center">
            
            {/* Header Shield */}
            <div className="w-16 h-16 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center mx-auto text-amber-400">
              <ShieldAlert className="w-9 h-9" />
            </div>

            <div className="space-y-2">
              <span className="px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-bold uppercase tracking-wider">
                🤖 AI Self-Healing Safe Zone
              </span>
              <h1 className="text-xl sm:text-2xl font-black text-white font-['Outfit',sans-serif]">
                Card Load Me Dikkat Aayi
              </h1>
              <p className="text-xs sm:text-sm text-slate-300">
                AI Health Guard ne crash ko isolate kar diya hai taaki puri site band na ho.
              </p>
            </div>

            {/* Error Detail Box */}
            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-left font-mono text-xs text-rose-300 overflow-x-auto max-h-32">
              <code>{this.state.error?.message || 'Unexpected state exception'}</code>
            </div>

            {/* Actions */}
            <div className="space-y-3">
              <button
                onClick={this.handleAutoRecover}
                className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-sm flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 cursor-pointer transition-all hover:scale-[1.02]"
              >
                <Wrench className="w-4 h-4" />
                <span>Auto-Repair & Go to Home (खुद ठीक करें)</span>
              </button>

              <div className="flex gap-2">
                <button
                  onClick={this.handleCopyAiReport}
                  className="flex-1 py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 border border-slate-700 text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
                >
                  {this.state.copiedPrompt ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Report Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy AI Fix Report</span>
                    </>
                  )}
                </button>

                <button
                  onClick={this.handleFullReset}
                  className="py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Fresh Reload</span>
                </button>
              </div>
            </div>

            <p className="text-[11px] text-slate-500">
              Tip: "Copy AI Fix Report" par click karke aap AI chat me bhej sakte hain aur AI use turant theek kar dega.
            </p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
