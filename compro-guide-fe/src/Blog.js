import React, { useState, useEffect } from 'react';
import './App.css';

export default function Blog() {
  const [posts, setPosts] = useState(null);
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
    return () => { mounted = false; };
  }, []);

  function formatCreated(post) {
    const ts = post.created ?? post.published ?? post.date ?? null;
    if (!ts) return null;
    const n = Number(ts) < 1e12 ? Number(ts) * 1000 : Number(ts);
    return new Date(n).toLocaleString();
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
        <h2>Blog</h2>
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
        <div className="reviews-list">
          {posts.length === 0 && <p>No posts found.</p>}
          {posts.map((p, i) => (
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
              <div style={{ marginTop: 6, fontSize: '0.9rem', color: '#666' }}>
                {p.author ? `By ${p.author}` : ''}
                {formatCreated(p) && ` • Created on ${formatCreated(p)}`}
              </div>
            </article>
          ))}
        </div>
      )}

      {showModal && selectedPost && (
        <div className="modal-overlay" role="dialog" aria-modal="true">
          <div className="modal">
            <button className="modal-close" onClick={() => { setShowModal(false); setSelectedPost(null); }} aria-label="Close">×</button>
            <div className="modal-content">
              <h2>{selectedPost.title || selectedPost.subject}</h2>
              <div style={{ color: '#666', marginBottom: 8 }}>
                {selectedPost.author ? `By ${selectedPost.author}` : ''}
                {formatCreated(selectedPost) && ` • Created on ${formatCreated(selectedPost)}`}
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