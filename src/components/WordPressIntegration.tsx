import React, { useState } from 'react';
import { 
  Globe, 
  Code2, 
  Download, 
  Copy, 
  Check, 
  FileCode, 
  ShieldCheck, 
  Layers, 
  Sparkles, 
  CheckCircle2, 
  ExternalLink,
  BookOpen,
  Laptop,
  HelpCircle
} from 'lucide-react';

interface WordPressIntegrationProps {
  currentAdminPin: string;
}

export const WordPressIntegration: React.FC<WordPressIntegrationProps> = ({ currentAdminPin }) => {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [selectedMethod, setSelectedMethod] = useState<'plugin' | 'shortcode' | 'page_template' | 'iframe'>('plugin');

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(id);
    setTimeout(() => setCopiedCode(null), 2500);
  };

  const appCurrentUrl = typeof window !== 'undefined' ? window.location.origin + window.location.pathname : 'https://your-domain.com';

  // 1. Ready to use WordPress Plugin PHP Code
  const wordpressPluginCode = `<?php
/**
 * Plugin Name: Yono Gaming & APK Portal
 * Plugin URI: https://yourdomain.com/
 * Description: Complete Yono Games APK Portal with Visitor Front-End & WP-Admin Manager.
 * Version: 2.0.0
 * Author: Master Admin
 * License: GPL2
 */

if (!defined('ABSPATH')) {
    exit; // Exit if accessed directly
}

class Yono_Portal_Plugin {
    public function __construct() {
        // Register Shortcode [yono_portal]
        add_shortcode('yono_portal', array($this, 'render_frontend_portal'));
        add_shortcode('yono_games', array($this, 'render_frontend_portal'));
        
        // Add Admin Menu inside WordPress WP-Admin
        add_action('admin_menu', array($this, 'add_admin_menu'));
    }

    /**
     * Add menu in WordPress Admin Dashboard
     */
    public function add_admin_menu() {
        add_menu_page(
            'Yono Apps Manager',
            '🎮 Yono Apps Admin',
            'manage_options',
            'yono-apps-manager',
            array($this, 'render_wp_admin_page'),
            'dashicons-games',
            30
        );
    }

    /**
     * Render WP-Admin Page for WordPress Admin
     */
    public function render_wp_admin_page() {
        $portal_url = plugins_url('app/index.html', __FILE__);
        // Or your deployed URL with auto-admin param
        ?>
        <div class="wrap" style="margin: 10px 0 0 0; padding: 0;">
            <div style="display: flex; justify-content: space-between; align-items: center; background: #0f172a; padding: 15px 20px; border-radius: 12px 12px 0 0; border: 1px solid #1e293b; border-bottom: none;">
                <div>
                    <h1 style="color: #f59e0b; margin: 0; font-size: 20px; font-weight: 800;">⚡ YONO PORTAL - WORDPRESS ADMIN CONTROL</h1>
                    <p style="color: #94a3b8; margin: 4px 0 0 0; font-size: 12px;">Add new apps, change download links, upload logos & update bonuses directly from your WordPress.</p>
                </div>
                <div>
                    <a href="<?php echo esc_url(home_url('/yono/')); ?>" target="_blank" class="button button-primary" style="background: #f59e0b; border-color: #f59e0b; color: #000; font-weight: bold;">
                        🔗 View Public Site
                    </a>
                </div>
            </div>
            <iframe 
                src="<?php echo esc_url('${appCurrentUrl}?wp_admin_auto=1#admin'); ?>" 
                style="width: 100%; height: calc(100vh - 120px); min-height: 800px; border: 1px solid #1e293b; border-radius: 0 0 12px 12px; background: #020617;"
                allow="clipboard-write; clipboard-read"
            ></iframe>
        </div>
        <?php
    }

    /**
     * Render Front-end Shortcode for Normal Visitors
     */
    public function render_frontend_portal($atts) {
        $atts = shortcode_atts(array(
            'height' => '100vh',
            'min_height' => '900px'
        ), $atts);

        // If WordPress Administrator is logged in, they can also access admin mode
        $is_admin = current_user_can('manage_options') ? '?wp_logged_in=1' : '';
        $src = '${appCurrentUrl}' . $is_admin;

        ob_start();
        ?>
        <div class="yono-portal-wrapper" style="width: 100vw; position: relative; left: 50%; right: 50%; margin-left: -50vw; margin-right: -50vw; overflow: hidden; background: #020617;">
            <iframe 
                src="<?php echo esc_url($src); ?>" 
                style="width: 100%; height: <?php echo esc_attr($atts['height']); ?>; min-height: <?php echo esc_attr($atts['min_height']); ?>; border: none; display: block;" 
                allow="clipboard-write; clipboard-read; fullscreen"
                loading="lazy"
            ></iframe>
        </div>
        <?php
        return ob_get_clean();
    }
}

new Yono_Portal_Plugin();
`;

  // 2. Shortcode Code snippet
  const shortcodeSnippet = `[yono_portal height="100vh" min_height="900px"]`;

  // 3. Custom HTML / Elementor Embed Code
  const directEmbedHtml = `<!-- YONO GAMING & APK PORTAL FULLSCREEN EMBED FOR WORDPRESS -->
<div style="width: 100%; min-height: 100vh; background: #020617; overflow: hidden; margin: 0; padding: 0;">
  <iframe 
    src="${appCurrentUrl}" 
    style="width: 100%; height: 100vh; min-height: 900px; border: none; margin: 0; padding: 0; display: block;"
    allow="clipboard-write; clipboard-read"
    loading="lazy"
  ></iframe>
</div>`;

  // 4. Standalone WordPress Page Template (`page-yono.php`)
  const pageTemplatePhp = `<?php
/**
 * Template Name: Yono APK Portal Fullscreen
 * Description: Fullscreen Yono Portal Template for WordPress
 */

// If admin is logged in in WordPress, pass auth bridge
$is_wp_admin = current_user_can('manage_options') ? '?wp_admin_auto=1#admin' : '';
$embed_url = '${appCurrentUrl}' . $is_wp_admin;
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <title>ALL NEW YONO APPS (2026) - Official APK Download</title>
    <meta name="description" content="Download verified Yono Rummy, Teen Patti & Casino games with highest signup bonuses.">
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        html, body { width: 100%; height: 100%; overflow: hidden; background: #020617; }
        iframe { width: 100%; height: 100%; border: none; display: block; }
    </style>
</head>
<body>
    <iframe src="<?php echo esc_url($embed_url); ?>" allow="clipboard-write; clipboard-read" allowfullscreen></iframe>
</body>
</html>`;

  const downloadPluginFile = () => {
    const blob = new Blob([wordpressPluginCode], { type: 'application/x-php' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'yono-portal-plugin.php';
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Top Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-blue-950/80 via-slate-900 to-amber-950/30 border border-blue-500/30 relative overflow-hidden shadow-xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-500/30 text-blue-300 text-xs font-bold">
              <Globe className="w-3.5 h-3.5 text-blue-400" />
              <span>WORDPRESS & FREE HOSTING INTEGRATION GUIDE (वर्डप्रेस गाइड)</span>
            </div>
            
            <h2 className="text-xl sm:text-2xl font-black text-white font-['Outfit',sans-serif]">
              Run on Free WordPress Hosting with Full Admin Control
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Aap is poore Yono Gaming Portal ko apni **Free WordPress Hosting** (jaise InfinityFree, 000webhost, Hostinger ya cPanel) par aasani se chala sakte hain.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={downloadPluginFile}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 text-slate-950 font-black text-xs shadow-lg shadow-amber-500/20 transition-all hover:scale-105 cursor-pointer"
            >
              <Download className="w-4 h-4 stroke-[2.5]" />
              <span>Download WP Plugin (.php)</span>
            </button>
          </div>
        </div>
      </div>

      {/* How it Works Summary (WordPress Admin vs Visitor) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* Visitor Experience Card */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
          <div className="flex items-center gap-2 text-emerald-400">
            <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
              <Laptop className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Normal Visitors (पब्लिक यूजर)</h3>
              <span className="text-[11px] text-emerald-400 font-mono">Frontend WordPress Page</span>
            </div>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Jab koi aam visitor aapki WordPress website (<code className="text-amber-300">yourdomain.com/yono/</code>) open karega, to unhe **sirf Game Catalog, Download APK buttons, Spin Wheel aur Bonus details** dikhenge. Unhe koi admin controls nahi dikhega.
          </p>
        </div>

        {/* Admin Experience Card */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-amber-500/30 space-y-3">
          <div className="flex items-center gap-2 text-amber-400">
            <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/20">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Your Admin Control (आपका कंट्रोल)</h3>
              <span className="text-[11px] text-amber-400 font-mono">WordPress WP-Admin Dashboard</span>
            </div>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Jab aap apna WordPress login (<code className="text-amber-300">/wp-admin/</code>) karenge, to WordPress menu mein <strong className="text-white">"🎮 Yono Apps Admin"</strong> dikhega. Wahan se aap **Photo upload, App Add/Edit, APK links aur Bonus** poora control kar payenge.
          </p>
        </div>

      </div>

      {/* Integration Methods Selector */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-6">
        
        <div className="flex flex-wrap items-center gap-2 border-b border-slate-800 pb-4">
          <button
            onClick={() => setSelectedMethod('plugin')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
              selectedMethod === 'plugin'
                ? 'bg-amber-500 text-slate-950 shadow-md'
                : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <FileCode className="w-4 h-4" />
            <span>Method 1: WordPress Plugin (Recommended - सबसे आसान)</span>
          </button>

          <button
            onClick={() => setSelectedMethod('shortcode')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
              selectedMethod === 'shortcode'
                ? 'bg-amber-500 text-slate-950 shadow-md'
                : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <Code2 className="w-4 h-4" />
            <span>Method 2: Shortcode / Gutenberg / Elementor</span>
          </button>

          <button
            onClick={() => setSelectedMethod('page_template')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
              selectedMethod === 'page_template'
                ? 'bg-amber-500 text-slate-950 shadow-md'
                : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Method 3: Theme Page Template (page-yono.php)</span>
          </button>

          <button
            onClick={() => setSelectedMethod('iframe')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
              selectedMethod === 'iframe'
                ? 'bg-amber-500 text-slate-950 shadow-md'
                : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <ExternalLink className="w-4 h-4" />
            <span>Method 4: Direct Custom HTML Block</span>
          </button>
        </div>

        {/* METHOD 1: WORDPRESS PLUGIN */}
        {selectedMethod === 'plugin' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-slate-950 p-4 rounded-2xl border border-slate-800">
              <div>
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>WordPress Plugin Code (yono-portal-plugin.php)</span>
                </h4>
                <p className="text-xs text-slate-400 mt-1">
                  Save this as <code className="text-amber-400">yono-portal-plugin.php</code> and upload in WordPress &gt; Plugins &gt; Add New.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={downloadPluginFile}
                  className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download .PHP</span>
                </button>
                <button
                  onClick={() => handleCopy(wordpressPluginCode, 'plugin_code')}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  {copiedCode === 'plugin_code' ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Code</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Code Display */}
            <div className="relative">
              <pre className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-slate-300 font-mono text-xs overflow-x-auto max-h-80 select-all leading-relaxed">
                {wordpressPluginCode}
              </pre>
            </div>

            {/* Step by Step Guide in Hindi */}
            <div className="p-4 rounded-2xl bg-amber-500/5 border border-amber-500/20 space-y-2">
              <h5 className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
                <BookOpen className="w-4 h-4" />
                <span>Wordpress me lagane ka simple tarika (Step-by-Step):</span>
              </h5>
              <ol className="list-decimal list-inside text-xs text-slate-300 space-y-1.5 pl-1 leading-relaxed">
                <li>Upar diye gaye <strong className="text-amber-300">"Download .PHP"</strong> button par click karke file download karein.</li>
                <li>Apne WordPress Admin (<code className="text-slate-400">yourdomain.com/wp-admin</code>) me login karein.</li>
                <li>Left menu me <strong className="text-white">Plugins &gt; Add New &gt; Upload Plugin</strong> par click karke download ki hui file choose karein aur <strong>"Activate"</strong> kar dein.</li>
                <li>Ab WordPress Admin ke left sidebar me <strong className="text-amber-400">"🎮 Yono Apps Admin"</strong> ka menu aa jayega jahan se aap complete website edit kar payenge!</li>
                <li>Front-end par dikhane ke liye WordPress me ek Page banayein (jaise "Yono Games") aur usme shortcode <code className="text-amber-400 bg-slate-900 px-1 py-0.5 rounded">[yono_portal]</code> likh kar Publish kar dein.</li>
              </ol>
            </div>
          </div>
        )}

        {/* METHOD 2: SHORTCODE */}
        {selectedMethod === 'shortcode' && (
          <div className="space-y-4">
            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-300">WordPress Shortcode:</span>
                <button
                  onClick={() => handleCopy(shortcodeSnippet, 'shortcode')}
                  className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                >
                  {copiedCode === 'shortcode' ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-950" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Shortcode</span>
                    </>
                  )}
                </button>
              </div>

              <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 font-mono text-amber-300 text-sm">
                {shortcodeSnippet}
              </div>
            </div>

            <div className="text-xs text-slate-300 space-y-2 leading-relaxed">
              <p><strong>Kahan paste karein:</strong></p>
              <ul className="list-disc list-inside space-y-1 text-slate-400 pl-1">
                <li><strong>Gutenberg Editor:</strong> Page edit karte waqt '+' dabakar "Shortcode" block select karein aur paste karein.</li>
                <li><strong>Elementor Page Builder:</strong> "Shortcode" widget drag karein aur paste karein. Page layout ko "Elementor Canvas" ya "Full Width" rakhein.</li>
              </ul>
            </div>
          </div>
        )}

        {/* METHOD 3: PAGE TEMPLATE */}
        {selectedMethod === 'page_template' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between bg-slate-950 p-4 rounded-2xl border border-slate-800">
              <div>
                <h4 className="text-sm font-bold text-white">Custom Theme Template (page-yono.php)</h4>
                <p className="text-xs text-slate-400">Put this file inside your active WordPress theme directory (<code className="text-amber-400">wp-content/themes/your-theme/page-yono.php</code>).</p>
              </div>
              <button
                onClick={() => handleCopy(pageTemplatePhp, 'page_template')}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
              >
                {copiedCode === 'page_template' ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy PHP Template</span>
                  </>
                )}
              </button>
            </div>

            <pre className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-slate-300 font-mono text-xs overflow-x-auto max-h-72 select-all leading-relaxed">
              {pageTemplatePhp}
            </pre>
          </div>
        )}

        {/* METHOD 4: DIRECT HTML / IFRAME */}
        {selectedMethod === 'iframe' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between bg-slate-950 p-4 rounded-2xl border border-slate-800">
              <div>
                <h4 className="text-sm font-bold text-white">Direct Custom HTML Block</h4>
                <p className="text-xs text-slate-400">Paste inside WordPress "Custom HTML" block or Elementor "HTML" widget.</p>
              </div>
              <button
                onClick={() => handleCopy(directEmbedHtml, 'html_embed')}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
              >
                {copiedCode === 'html_embed' ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy HTML</span>
                  </>
                )}
              </button>
            </div>

            <pre className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-slate-300 font-mono text-xs overflow-x-auto max-h-72 select-all leading-relaxed">
              {directEmbedHtml}
            </pre>
          </div>
        )}

      </div>

      {/* Free Hosting Tips (000webhost / InfinityFree / ProFreeHost) */}
      <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-3">
        <h4 className="text-sm font-bold text-white flex items-center gap-2">
          <HelpCircle className="w-4 h-4 text-amber-400" />
          <span>Free Hosting Important Notes (InfinityFree / 000webhost):</span>
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-slate-400">
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
            <span className="text-white font-bold block">1. 100% Free Compatible</span>
            <p>Free WordPress hosting par PHP plugins aur custom HTML 100% perfectly kaam karte hain.</p>
          </div>
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
            <span className="text-white font-bold block">2. Fast Speed & No Lag</span>
            <p>App frontend ultra-lightweight hai isliye free hosting ke CPU limits par koi load nahi padega.</p>
          </div>
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
            <span className="text-white font-bold block">3. One-Click Backup</span>
            <p>Admin panel ke "Security & Backup" tab se aap kabhi bhi apne sabhi apps ka JSON backup le sakte hain.</p>
          </div>
        </div>
      </div>

    </div>
  );
};
