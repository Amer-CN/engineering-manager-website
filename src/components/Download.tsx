import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Download as DownloadIcon, ExternalLink, FileCode, Package, Shield, Cpu, GitBranch, X, ChevronDown } from 'lucide-react'

const GITHUB_REPO = 'https://github.com/Amer-CN/engineering-manager'
const RELEASE_API = 'https://api.github.com/repos/Amer-CN/engineering-manager/releases/latest'
// jsDelivr CDN 在国内有节点，raw.githubusercontent.com 国内被墙
const CHANGELOG_URLS = [
  'https://cdn.jsdelivr.net/gh/Amer-CN/engineering-manager@master/src/constants/changelog.ts',
  'https://fastly.jsdelivr.net/gh/Amer-CN/engineering-manager@master/src/constants/changelog.ts',
  'https://raw.githubusercontent.com/Amer-CN/engineering-manager/master/src/constants/changelog.ts',
]

const mirrorUrl = 'https://cloud.189.cn/web/share?code=jUjM73RJRbUv'
const mirrorUrl2 = 'https://1821605241.share.123865.com/123pan/uSpfjv-LWVVv'

const FALLBACK_VERSION = 'v0.81.7'

const requirements = [
  { label: '操作系统', value: 'Windows 10 1809+ / Windows 11' },
  { label: '架构', value: 'x64' },
  { label: '运行时', value: '.NET 8.0 Desktop Runtime（内置）' },
  { label: '存储空间', value: '约 500MB' },
  { label: '内存', value: '推荐 8GB+' },
]

interface ReleaseInfo {
  version: string
  downloadUrl: string
  sizeMB: number | null
}

interface ChangelogGroup {
  label: string
  items: string[]
}

interface ChangelogVersion {
  v: string
  date: string
  items?: string[]
  groups?: ChangelogGroup[]
}

function useLatestRelease() {
  const [release, setRelease] = useState<ReleaseInfo | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(RELEASE_API)
      .then(res => {
        if (!res.ok) throw new Error('GitHub API error')
        return res.json()
      })
      .then(data => {
        const asset = data.assets?.find((a: { name?: string }) => a.name?.endsWith('.exe'))
        setRelease({
          version: data.tag_name,
          downloadUrl: asset?.browser_download_url || `${GITHUB_REPO}/releases/latest`,
          sizeMB: asset?.size ? Math.round(asset.size / 1024 / 1024) : null,
        })
      })
      .catch(() => {
        setRelease(null)
      })
      .finally(() => setLoading(false))
  }, [])

  return { release, loading }
}

/**
 * 解析 changelog.ts 文件内容，提取版本数组。
 * 文件来自用户自己的 GitHub 仓库，内容可信，使用 Function 构造器解析。
 * 同时兼容旧版 items 格式和新版 groups 分组格式。
 */
function parseChangelog(text: string): ChangelogVersion[] {
  try {
    const match = text.match(/versions[\s\S]*?=\s*(\[[\s\S]*\])/)
    if (match) {
      const parsed = new Function(`return ${match[1]}`)()
      if (Array.isArray(parsed)) return parsed
    }
  } catch (e) {
    console.error('Failed to parse changelog:', e)
  }
  return []
}

function fetchWithFallback(urls: string[]): Promise<Response> {
  return urls.reduce(
    (prev, url) => prev.catch(() => fetch(url)),
    Promise.reject(new Error('No URLs'))
  )
}

function useChangelog() {
  const [versions, setVersions] = useState<ChangelogVersion[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchWithFallback(CHANGELOG_URLS)
      .then(res => {
        if (!res.ok) throw new Error('Changelog fetch error')
        return res.text()
      })
      .then(text => {
        setVersions(parseChangelog(text))
      })
      .catch(() => setVersions([]))
      .finally(() => setLoading(false))
  }, [])

  return { versions, loading }
}

function ChangelogModal({ open, onClose, versions, loading }: {
  open: boolean
  onClose: () => void
  versions: ChangelogVersion[]
  loading: boolean
}) {
  const [expanded, setExpanded] = useState<Set<string>>(new Set())

  useEffect(() => {
    if (open && versions.length > 0 && expanded.size === 0) {
      setExpanded(new Set([versions[0].v]))
    }
  }, [open, versions])

  const toggle = (v: string) => {
    setExpanded(prev => {
      const next = new Set(prev)
      if (next.has(v)) next.delete(v)
      else next.add(v)
      return next
    })
  }

  return (
    <AnimatePresence>
      {open && (
        <div className="cl-overlay" onClick={onClose}>
          <motion.div
            className="cl-modal"
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            onClick={e => e.stopPropagation()}
          >
            <div className="cl-header">
              <h2 className="cl-title">
                <FileCode size={20} />
                更新日志
              </h2>
              <button className="cl-close" onClick={onClose}><X size={20} /></button>
            </div>

            <div className="cl-body">
              {loading ? (
                <div className="cl-loading">加载中...</div>
              ) : versions.length === 0 ? (
                <div className="cl-loading">暂无更新日志</div>
              ) : (
                versions.map(item => (
                  <div key={item.v} className="cl-version">
                    <button className="cl-version-header" onClick={() => toggle(item.v)}>
                      <div className="cl-version-info">
                        <span className="cl-version-tag">{item.v}</span>
                        <span className="cl-version-date">{item.date}</span>
                      </div>
                      <ChevronDown
                        size={16}
                        style={{
                          transform: expanded.has(item.v) ? 'rotate(180deg)' : 'rotate(0)',
                          transition: 'transform 0.2s',
                          color: 'var(--text-muted)',
                          flexShrink: 0,
                        }}
                      />
                    </button>
                    {expanded.has(item.v) && (
                      <div className="cl-version-body">
                        {item.groups ? (
                          item.groups.map((group, gi) => (
                            <div key={gi} className="cl-group">
                              <div className="cl-group-label">{group.label}</div>
                              <ul className="cl-items">
                                {group.items.map((text, i) => (
                                  <li key={i}>{text}</li>
                                ))}
                              </ul>
                            </div>
                          ))
                        ) : (
                          <ul className="cl-items">
                            {item.items?.map((text, i) => (
                              <li key={i}>{text}</li>
                            ))}
                          </ul>
                        )}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

export default function Download() {
  const { release, loading } = useLatestRelease()
  const { versions, loading: changelogLoading } = useChangelog()
  const [changelogOpen, setChangelogOpen] = useState(false)

  const version = release?.version || versions[0]?.v || FALLBACK_VERSION
  const versionNoV = version.replace(/^v/, '')
  const downloadUrl = release?.downloadUrl
    || `${GITHUB_REPO}/releases/download/${version}/EngineeringManager-Setup-${versionNoV}.exe`
  const sizeMB = release?.sizeMB ?? null

  return (
    <>
      <section id="download" className="section">
        <div className="container">
          <div className="section-header">
            <motion.span initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="section-label">
              DOWNLOAD
            </motion.span>
            <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }} className="section-title">
              立即下载工程管家
            </motion.h2>
            <motion.p initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }} className="section-desc">
              免费使用，安装即用。数据完全存储在本地，安全可控。
            </motion.p>
          </div>

          <div className="download-layout">
            <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }} className="download-card">
              <div className="download-card-icon">
                <Package size={32} color="white" />
              </div>
              {loading ? (
                <div className="download-card-badge download-card-badge--loading">加载版本信息...</div>
              ) : (
                <div className="download-card-badge">
                  <FileCode size={13} />
                  {version}
                </div>
              )}
              <h3 className="download-card-title">工程管家 安装包</h3>
              <p className="download-card-desc">
                桌面客户端，安装后即可使用。数据路径可自由配置，支持多用户权限管理。
              </p>
              <a
                href={loading ? undefined : downloadUrl}
                className="download-btn"
                style={{ opacity: loading ? 0.6 : 1, pointerEvents: loading ? 'none' : 'auto' }}
              >
                <DownloadIcon size={18} />
                下载安装包{sizeMB ? `（~${sizeMB}MB）` : ''}
              </a>
              {mirrorUrl && (
                <a href={mirrorUrl} target="_blank" rel="noopener noreferrer" className="download-mirror">
                  天翼云盘（访问码 yqq4）<ExternalLink size={12} />
                </a>
              )}
              {mirrorUrl2 && (
                <a href={mirrorUrl2} target="_blank" rel="noopener noreferrer" className="download-mirror">
                  123 云盘（提取码 HovS）<ExternalLink size={12} />
                </a>
              )}
              <div className="download-links">
                <a href={`${GITHUB_REPO}/releases`} target="_blank" rel="noopener noreferrer" className="download-link">
                  <GitBranch size={13} /> GitHub Releases
                </a>
                <button onClick={() => setChangelogOpen(true)} className="download-link download-link--btn">
                  <FileCode size={13} /> 更新日志
                </button>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.1, ease: [0.25, 0.46, 0.45, 0.94] }} className="requirements-card">
              <div className="requirements-header">
                <Cpu size={18} />
                <span>系统要求</span>
              </div>
              <div className="requirements-list">
                {requirements.map(req => (
                  <div key={req.label} className="requirements-row">
                    <span className="requirements-label">{req.label}</span>
                    <span className="requirements-value">{req.value}</span>
                  </div>
                ))}
              </div>
              <div className="requirements-note">
                <Shield size={13} />
                数据存储路径由用户自由配置，卸载时不影响数据安全
              </div>
            </motion.div>
          </div>
        </div>

        <style>{`
          .download-layout {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 24px;
            max-width: 880px;
            margin: 0 auto;
          }
          .download-card {
            background: var(--bg-card);
            border: 1px solid var(--border);
            border-radius: var(--radius-lg, 20px);
            padding: 40px 36px;
            display: flex;
            flex-direction: column;
            align-items: center;
            text-align: center;
            transition: border-color 0.3s;
          }
          .download-card:hover {
            border-color: color-mix(in srgb, var(--primary) 30%, transparent);
          }
          .download-card-icon {
            width: 64px;
            height: 64px;
            border-radius: 18px;
            background: linear-gradient(135deg, var(--primary), var(--accent));
            display: flex;
            align-items: center;
            justify-content: center;
            margin-bottom: 20px;
          }
          .download-card-badge {
            display: inline-flex;
            align-items: center;
            gap: 5px;
            padding: 4px 12px;
            border-radius: 16px;
            background: color-mix(in srgb, var(--primary) 10%, transparent);
            border: 1px solid color-mix(in srgb, var(--primary) 20%, transparent);
            font-size: 12px;
            font-weight: 600;
            color: var(--primary);
            margin-bottom: 16px;
          }
          .download-card-badge--loading {
            opacity: 0.6;
          }
          .download-card-title {
            font-size: 20px;
            font-weight: 700;
            color: var(--text);
            margin: 0 0 8px;
          }
          .download-card-desc {
            font-size: 14px;
            color: var(--text-secondary);
            margin: 0 0 28px;
            line-height: 1.6;
          }
          .download-btn {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            padding: 14px 36px;
            border-radius: 46px;
            background: linear-gradient(135deg, var(--primary), var(--accent));
            color: white;
            font-size: 15px;
            font-weight: 600;
            text-decoration: none;
            transition: transform 0.2s, box-shadow 0.2s;
            box-shadow: 0 4px 20px color-mix(in srgb, var(--primary) 30%, transparent);
          }
          .download-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 30px color-mix(in srgb, var(--primary) 40%, transparent);
          }
          .download-mirror {
            display: inline-flex;
            align-items: center;
            gap: 4px;
            margin-top: 10px;
            font-size: 12px;
            color: var(--text-muted);
            text-decoration: none;
            transition: color 0.2s;
          }
          .download-mirror:hover {
            color: var(--primary);
          }
          .download-links {
            display: flex;
            gap: 16px;
            margin-top: 16px;
            flex-wrap: wrap;
            justify-content: center;
          }
          .download-link {
            display: inline-flex;
            align-items: center;
            gap: 5px;
            font-size: 13px;
            color: var(--text-muted);
            text-decoration: none;
            transition: color 0.2s;
          }
          .download-link:hover {
            color: var(--primary);
          }
          .download-link--btn {
            background: none;
            border: none;
            cursor: pointer;
            font-family: inherit;
            padding: 0;
          }

          /* 系统要求 */
          .requirements-card {
            background: var(--bg-card);
            border: 1px solid var(--border);
            border-radius: var(--radius-lg, 20px);
            padding: 36px;
            display: flex;
            flex-direction: column;
          }
          .requirements-header {
            display: flex;
            align-items: center;
            gap: 8px;
            font-size: 15px;
            font-weight: 600;
            color: var(--text);
            margin-bottom: 24px;
          }
          .requirements-list {
            flex: 1;
            display: flex;
            flex-direction: column;
          }
          .requirements-row {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 14px 0;
            border-bottom: 1px solid var(--border);
          }
          .requirements-row:last-child {
            border-bottom: none;
          }
          .requirements-label {
            font-size: 14px;
            color: var(--text-secondary);
          }
          .requirements-value {
            font-size: 14px;
            font-weight: 500;
            color: var(--text);
          }
          .requirements-note {
            display: flex;
            align-items: center;
            gap: 6px;
            margin-top: 20px;
            font-size: 12px;
            color: var(--text-muted);
          }

          /* 更新日志弹窗 */
          .cl-overlay {
            position: fixed;
            inset: 0;
            z-index: 9999;
            background: rgba(0,0,0,0.45);
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 24px;
          }
          .cl-modal {
            background: var(--bg);
            backdrop-filter: none;
            border: 1px solid var(--border);
            border-radius: 20px;
            width: 100%;
            max-width: 560px;
            max-height: 80vh;
            display: flex;
            flex-direction: column;
            overflow: hidden;
            box-shadow: 0 24px 80px rgba(0,0,0,0.25);
            backdrop-filter: none;
          }
          .cl-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 20px 24px;
            border-bottom: 1px solid var(--border);
            flex-shrink: 0;
          }
          .cl-title {
            display: flex;
            align-items: center;
            gap: 8px;
            margin: 0;
            font-size: 17px;
            font-weight: 700;
            color: var(--text);
          }
          .cl-close {
            background: none;
            border: none;
            cursor: pointer;
            color: var(--text-muted);
            padding: 4px;
            border-radius: 6px;
            display: flex;
            transition: background 0.15s;
          }
          .cl-close:hover {
            background: var(--bg-secondary);
          }
          .cl-body {
            overflow-y: auto;
            padding: 8px 0;
            flex: 1;
          }
          .cl-loading {
            text-align: center;
            padding: 40px 24px;
            color: var(--text-muted);
            font-size: 14px;
          }
          .cl-version {
            border-bottom: 1px solid var(--border);
          }
          .cl-version:last-child {
            border-bottom: none;
          }
          .cl-version-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            width: 100%;
            padding: 14px 24px;
            background: none;
            border: none;
            cursor: pointer;
            font-family: inherit;
            text-align: left;
            transition: background 0.15s;
          }
          .cl-version-header:hover {
            background: var(--bg-secondary);
          }
          .cl-version-info {
            display: flex;
            align-items: center;
            gap: 12px;
          }
          .cl-version-tag {
            font-size: 14px;
            font-weight: 700;
            color: var(--primary);
          }
          .cl-version-date {
            font-size: 12px;
            color: var(--text-muted);
          }
          .cl-version-body {
            padding-bottom: 14px;
          }
          .cl-group {
            padding: 0 24px;
          }
          .cl-group + .cl-group {
            margin-top: 8px;
          }
          .cl-group-label {
            font-size: 12px;
            font-weight: 600;
            color: var(--text-muted);
            margin-bottom: 6px;
            padding-left: 0;
          }
          .cl-items {
            margin: 0;
            padding: 0 0 0 16px;
            list-style: none;
          }
          .cl-items li {
            position: relative;
            padding: 4px 0 4px 16px;
            font-size: 13px;
            color: var(--text-secondary);
            line-height: 1.6;
          }
          .cl-items li::before {
            content: '';
            position: absolute;
            left: 0;
            top: 12px;
            width: 6px;
            height: 6px;
            border-radius: 50%;
            background: var(--primary);
            opacity: 0.5;
          }

          @media (max-width: 768px) {
            .download-layout {
              grid-template-columns: 1fr;
            }
            .cl-modal {
              max-width: 100%;
              max-height: 90vh;
            }
          }
        `}</style>
      </section>

      <ChangelogModal
        open={changelogOpen}
        onClose={() => setChangelogOpen(false)}
        versions={versions}
        loading={changelogLoading}
      />
    </>
  )
}