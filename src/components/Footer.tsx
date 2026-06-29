import { useState } from 'react'
import { GitBranch, Mail, MessageCircle, X } from 'lucide-react'
import Logo from './Logo'

export default function Footer() {
  const year = new Date().getFullYear()
  const [showQr, setShowQr] = useState(false)

  return (
    <>
      <footer className="site-footer">
        <div className="container">
          <div className="footer-grid">
            <div className="footer-brand">
              <div className="footer-logo">
                <Logo size={24} />
                <span>工程管家</span>
              </div>
              <p className="footer-tagline">
                建筑工程企业一站式管理平台，助力工程管理数字化转型。
              </p>
            </div>

            <div className="footer-links">
              <h4>快速链接</h4>
              {[
                { label: '功能特性', href: '#features' },
                { label: '软件截图', href: '#gallery' },
                { label: '下载', href: '#download' },
              ].map(link => (
                <a key={link.href} href={link.href} className="footer-link">
                  {link.label}
                </a>
              ))}
            </div>

            <div className="footer-links">
              <h4>联系与反馈</h4>
              <a
                href="https://github.com/Amer-CN/engineering-manager"
                target="_blank"
                rel="noopener noreferrer"
                className="footer-link"
              >
                <GitBranch size={13} /> GitHub
              </a>
              <a
                href="mailto:cd.hyxc.jz@foxmail.com"
                className="footer-link"
              >
                <Mail size={13} /> cd.hyxc.jz@foxmail.com
              </a>
              <button
                onClick={() => setShowQr(true)}
                className="footer-link footer-link--btn"
              >
                <MessageCircle size={13} /> 微信公众号：给自己造把锤子
              </button>
            </div>
          </div>

          <div className="footer-bottom">
            &copy; {year} 工程管家. 保留所有权利.
          </div>
        </div>
      </footer>

      {/* 二维码弹窗 */}
      {showQr && (
        <div className="qr-overlay" onClick={() => setShowQr(false)}>
          <div className="qr-modal" onClick={e => e.stopPropagation()}>
            <button className="qr-close" onClick={() => setShowQr(false)}>
              <X size={20} />
            </button>
            <img src="/wechat-qr.webp" alt="微信公众号：给自己造把锤子" className="qr-img" />
            <p className="qr-tip">微信扫一扫 关注公众号</p>
          </div>
        </div>
      )}

      <style>{`
        .site-footer {
          border-top: 1px solid var(--border);
          padding: 48px 0 32px;
          background: var(--bg-secondary);
        }
        .footer-grid {
          display: grid;
          grid-template-columns: 2fr 1fr 1fr;
          gap: 40px;
          margin-bottom: 40px;
        }
        .footer-logo {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 17px;
          font-weight: 700;
          color: var(--text);
          margin-bottom: 12px;
        }
        .footer-tagline {
          font-size: 13px;
          color: var(--text-muted);
          line-height: 1.7;
          margin: 0;
          max-width: 280px;
        }
        .footer-links h4 {
          font-size: 13px;
          font-weight: 600;
          color: var(--text);
          margin: 0 0 16px;
          letter-spacing: 0.02em;
        }
        .footer-link {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 13px;
          color: var(--text-muted);
          text-decoration: none;
          padding: 4px 0;
          transition: color 0.2s;
        }
        a.footer-link:hover {
          color: var(--text);
        }
        .footer-link--btn {
          background: none;
          border: none;
          cursor: pointer;
          font-family: inherit;
          text-align: left;
          padding: 4px 0;
        }
        .footer-link--btn:hover {
          color: var(--text);
        }
        .footer-bottom {
          border-top: 1px solid var(--border);
          padding-top: 20px;
          text-align: center;
          font-size: 12px;
          color: var(--text-muted);
        }

        /* 二维码弹窗 */
        .qr-overlay {
          position: fixed;
          inset: 0;
          z-index: 9999;
          background: rgba(0,0,0,0.45);
          display: flex;
          align-items: center;
          justify-content: center;
          animation: qrFadeIn 0.15s ease;
        }
        @keyframes qrFadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .qr-modal {
          position: relative;
          background: #fff;
          border-radius: 16px;
          padding: 32px 32px 24px;
          box-shadow: 0 20px 60px rgba(0,0,0,0.18);
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 16px;
          animation: qrScaleIn 0.2s ease;
        }
        @keyframes qrScaleIn {
          from { opacity: 0; transform: scale(0.9); }
          to { opacity: 1; transform: scale(1); }
        }
        .qr-close {
          position: absolute;
          top: 12px;
          right: 12px;
          background: none;
          border: none;
          cursor: pointer;
          color: #999;
          padding: 4px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background 0.15s, color 0.15s;
        }
        .qr-close:hover {
          background: #f0f0f0;
          color: #333;
        }
        .qr-img {
          width: 240px;
          height: 240px;
          object-fit: cover;
          border-radius: 8px;
        }
        .qr-tip {
          font-size: 14px;
          color: #666;
          margin: 0;
        }

        @media (max-width: 768px) {
          .footer-grid {
            grid-template-columns: 1fr;
            gap: 32px;
          }
          .qr-img {
            width: 200px;
            height: 200px;
          }
        }
      `}</style>
    </>
  )
}