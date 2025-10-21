import React, { useState, useEffect } from 'react';
import './App.css';

export default function Blog() {
  const [posts, setPosts] = useState(null);
  const [tagsWithCount, setTagsWithCount] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedPost, setSelectedPost] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // Create-post state
  const [createModal, setCreateModal] = useState(false);
  const [createTitle, setCreateTitle] = useState('How to pass FPP Pretest');
  const [createContent, setCreateContent] = useState('This is a guide on how to pass the FPP pretest.');
  const [tagInput, setTagInput] = useState('guide');
  const [tags, setTags] = useState([tagInput]);
  const [createError, setCreateError] = useState(null);
  const [createLoading, setCreateLoading] = useState(false);
  const [selectedTags, setSelectedTags] = useState([]);

  // loadPosts is reusable so we can call it after creating a new post
  useEffect(() => {
    let mounted = true;
    async function loadPosts() {
      if (!mounted) return;
      setLoading(true);
      setError(null);
      try {
        const resp = await fetch('/api/blogs');
        if (!resp.ok) throw new Error(`Request failed: ${resp.status} ${resp.statusText}`);
        const data = await resp.json();
        if (mounted) setPosts(data);
      } catch (err) {
        if (mounted) {
          setError(err.message || 'Unknown error');
          setPosts(null);
        }
      } finally {
        if (mounted) setLoading(false);
      }
    }
    loadPosts();
    // load tags with counts
    (async function loadTags() {
      try {
        const r = await fetch('/api/blogs/tags');
        if (!r.ok) throw new Error('Failed to load tags');
        const d = await r.json();
        if (mounted) {
          // backend returns an object map like { "tag1": 5, "tag2": 8 }
          let arr = [];
          if (d && typeof d === 'object' && !Array.isArray(d)) {
            arr = Object.keys(d).map(k => ({ tag: k, count: Number(d[k] || 0) }));
          } else if (Array.isArray(d)) {
            arr = d.slice();
          }
          arr.sort((a, b) => (b.count ?? 0) - (a.count ?? 0));
          setTagsWithCount(arr);
        }
      } catch (err) {
        // silently ignore tags error for now
        if (mounted) setTagsWithCount(null);
      }
    })();
    return () => { mounted = false; };
  }, []);

  // make it month/day/year only
  function formatCreated(post) {
    const ts = post.created ?? post.published ?? post.date ?? null;
    if (!ts) return null;
    const n = Number(ts) < 1e12 ? Number(ts) * 1000 : Number(ts);
    return new Date(n).toLocaleDateString('en-US');
  }

  // normalize tags from a post into an array of strings
  function getPostTags(p) {
    if (!p) return [];
    if (Array.isArray(p.tags)) return p.tags.map(x => String(x).trim()).filter(Boolean);
    if (typeof p.tags === 'string' && p.tags.trim()) return p.tags.split(/\s*,\s*/).map(x => x.trim()).filter(Boolean);
    // fallback fields
    if (Array.isArray(p.tag)) return p.tag.map(x => String(x).trim()).filter(Boolean);
    if (typeof p.tag === 'string' && p.tag.trim()) return p.tag.split(/\s*,\s*/).map(x => x.trim()).filter(Boolean);
    if (Array.isArray(p.tags_raw)) return p.tags_raw.map(x => String(x).trim()).filter(Boolean);
    if (typeof p.tags_raw === 'string' && p.tags_raw.trim()) return p.tags_raw.split(/\s*,\s*/).map(x => x.trim()).filter(Boolean);
    return [];
  }

  // Tag helpers for create modal
  function addTagFromInput() {
    const t = tagInput.trim();
    if (!t) return;
    if (tags.includes(t)) {
      setTagInput('');
      return;
    }
    setTags(prev => [...prev, t]);
    setTagInput('');
  }

  function removeTag(idx) {
    setTags(prev => prev.filter((_, i) => i !== idx));
  }

  async function submitCreatePost(e) {
    e && e.preventDefault && e.preventDefault();
    setCreateError(null);
    if (!createTitle.trim()) return setCreateError('Title is required');
    if (!createContent.trim()) return setCreateError('Content is required');
    setCreateLoading(true);
    try {
      const payload = {
        title: createTitle.trim(),
        content: createContent,
        tags: tags.toString()
      };
      const resp = await fetch('/api/blogs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!resp.ok) {
        const text = await resp.text();
        throw new Error(`Request failed: ${resp.status} ${resp.statusText} ${text}`);
      }
      // success — reload posts
      setCreateModal(false);
      setCreateTitle('');
      setCreateContent('');
      setTags([]);
      // reload posts
      setLoading(true);
      const r2 = await fetch('/api/blogs');
      if (r2.ok) {
        const data = await r2.json();
        setPosts(data);
      }
    } catch (err) {
      setCreateError(err.message || 'Failed to create post');
    } finally {
      setCreateLoading(false);
      setLoading(false);
    }
  }

  return (
    <section className="section">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <h2>Blogs</h2>
        <div>
          <button className="btn primary" onClick={() => setCreateModal(true)}>Create New Post</button>
        </div>
      </div>
      {loading && <p className="muted">Loading posts…</p>}
      {error && <p className="error">Error: {error}</p>}

      {!loading && !error && posts == null && (
        <p>No posts available.</p>
      )}

      {!loading && !error && Array.isArray(posts) && (
        <div className="blog-container">
          <aside className="tag-list">
            <h3>Tags</h3>
            {!tagsWithCount && <p className="muted">Loading tags…</p>}
            {Array.isArray(tagsWithCount) && (
              <ul>
                {tagsWithCount.map((t) => {
                  const checked = selectedTags.includes(t.tag);
                  return (
                    <li key={t.tag} style={{ display: 'flex', justifyContent: 'space-between', gap: 8, alignItems: 'center' }}>
                      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                        <input type="checkbox" checked={checked} onChange={() => {
                          setSelectedTags(prev => checked ? prev.filter(x => x !== t.tag) : [...prev, t.tag]);
                        }} />
                        <span>{t.tag}</span>
                      </div>
                      <span className="badge">{t.count}</span>
                    </li>
                  );
                })}
              </ul>
            )}
          </aside>

          <div className="reviews-list">
          {posts.length === 0 && <p>No posts found.</p>}
          {selectedTags.length > 0 && <div style={{ marginBottom: 8 }} className="muted">Filtering by: {selectedTags.join(', ')}</div>}
          {(function(){
            // client-side OR filtering: a post is shown if it has any of the selected tags
            if (!Array.isArray(posts)) return null;
            if (!selectedTags || selectedTags.length === 0) return posts;
            const normalized = posts.filter(p => {
              // support tags as array or comma-separated string
              let ptags = [];
              if (Array.isArray(p.tags)) ptags = p.tags.map(x => String(x).trim());
              else if (typeof p.tags === 'string' && p.tags.trim()) ptags = p.tags.split(/\s*,\s*/).map(x => x.trim());
              else if (p.tag || p.tags_raw) {
                const v = p.tag || p.tags_raw;
                if (Array.isArray(v)) ptags = v.map(x => String(x).trim());
                else if (typeof v === 'string' && v.trim()) ptags = v.split(/\s*,\s*/).map(x => x.trim());
              }
              if (!ptags || ptags.length === 0) return false;
              for (const t of selectedTags) {
                if (ptags.includes(t)) return true;
              }
              return false;
            });
            return normalized;
          })().map((p, i) => (
            <article
              key={p.id ?? p.blogId ?? i}
              className="review-card"
              role="button"
              tabIndex={0}
              onClick={() => { setSelectedPost(p); setShowModal(true); }}
              onKeyDown={(e) => { if (e.key === 'Enter') { setSelectedPost(p); setShowModal(true); } }}
            >
              <h3 className="review-title">{p.title || p.subject || `Post ${i + 1}`}</h3>
              <div className="review-body">{p.excerpt || p.summary || (p.body ? (typeof p.body === 'string' ? (p.body.slice(0, 200) + (p.body.length > 200 ? '…' : '')) : '') : '')}</div>
              <div style={{ marginTop: 6, fontSize: '0.9rem', color: '#666', display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'space-between' }}>
                <div>
                  {p.author ? `By ${p.author}` : ''}
                  {formatCreated(p) && ` • ${formatCreated(p)}`}
                </div>
                <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                  {getPostTags(p).map((t, idx) => (
                    <span key={idx} className="tag-chip" style={{ fontSize: '0.85rem' }}>{t}</span>
                  ))}
                </div>
              </div>
            </article>
          ))}
        </div>
        </div>
      )}

      {showModal && selectedPost && (
        <div className="modal-overlay" role="dialog" aria-modal="true">
          <div className="modal">
            <button className="modal-close" onClick={() => { setShowModal(false); setSelectedPost(null); }} aria-label="Close">×</button>
            <div className="modal-content">
              <h2>{selectedPost.title || selectedPost.subject}</h2>
              <div style={{ color: '#666', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'space-between' }}>
                <div>
                  {selectedPost.author ? `By ${selectedPost.author}` : ''}
                  {formatCreated(selectedPost) && ` • ${formatCreated(selectedPost)}`}
                </div>
                <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                  {getPostTags(selectedPost).map((t, i) => (
                    <span key={i} className="tag-chip" style={{ fontSize: '0.85rem' }}>{t}</span>
                  ))}
                </div>
              </div>
              <div className="review-body">{selectedPost.body || selectedPost.content || selectedPost.excerpt || ''}</div>
            </div>
          </div>
        </div>
      )}

      {createModal && (
        <div className="modal-overlay" role="dialog" aria-modal="true">
          <div className="modal">
            <button className="modal-close" onClick={() => { setCreateModal(false); setCreateError(null); }} aria-label="Close">×</button>
            <div className="modal-content">
              <h2>Create New Post</h2>
              {createError && <div className="error">{createError}</div>}
              <form onSubmit={submitCreatePost}>
                <div style={{ marginBottom: 8 }}>
                  <label style={{ display: 'block', marginBottom: 6 }}>Title</label>
                  <input className="input" value={createTitle} onChange={(e) => setCreateTitle(e.target.value)} />
                </div>
                <div style={{ marginBottom: 8 }}>
                  <label style={{ display: 'block', marginBottom: 6 }}>Content</label>
                  <textarea className="input" rows={8} value={createContent} onChange={(e) => setCreateContent(e.target.value)} />
                </div>
                <div style={{ marginBottom: 8 }}>
                  <label style={{ display: 'block', marginBottom: 6 }}>Tags</label>
                  <div className="tag-input-row">
                    <input className="input" value={tagInput} onChange={(e) => setTagInput(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addTagFromInput(); } }} placeholder="Add a tag and press Enter" />
                    <button type="button" className="btn" onClick={addTagFromInput} style={{ marginLeft: 8 }}>Add</button>
                  </div>
                  <div className="tags-row" style={{ marginTop: 8 }}>
                    {tags.map((t, i) => (
                      <span key={i} className="tag-chip">{t} <button type="button" className="tag-remove" onClick={() => removeTag(i)}>×</button></span>
                    ))}
                  </div>
                </div>

                <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
                  <button className="btn primary" type="submit" disabled={createLoading}>{createLoading ? 'Creating…' : 'Create Post'}</button>
                  <button type="button" className="btn" onClick={() => { setCreateModal(false); setCreateError(null); }}>Cancel</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}