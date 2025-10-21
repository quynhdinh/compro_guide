import React, { useState, useEffect } from 'react';
import './App.css';

export default function Courses() {
  const [courses, setCourses] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [selectedCourse, setSelectedCourse] = useState(null);
  const [courseReviews, setCourseReviews] = useState(null);
  const [courseReviewsLoading, setCourseReviewsLoading] = useState(false);
  const [courseReviewsError, setCourseReviewsError] = useState(null);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [formState, setFormState] = useState({
    reviewerName: 'Anonymous',
    difficulty: 3,
    workload: 15,
    date_taken: '2025-01-01',
    rating: 5,
    comment: 'This course is amazing'
  });
  const [formError, setFormError] = useState(null);
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [sortDir, setSortDir] = useState('asc');

  useEffect(() => {
    let mounted = true;
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const resp = await fetch('http://localhost:8080/api/courses');
        if (!resp.ok) throw new Error(`Request failed: ${resp.status} ${resp.statusText}`);
        const data = await resp.json();
        if (mounted) setCourses(data);
      } catch (err) {
        if (mounted) {
          setError(err.message || 'Unknown error');
          setCourses(null);
        }
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => { mounted = false; };
  }, []);

  // debounce search input
  useEffect(() => {
    const t = setTimeout(() => setDebouncedQuery(searchQuery.trim()), 300);
    return () => clearTimeout(t);
  }, [searchQuery]);

  function matchesQuery(course, q) {
    if (!q) return true;
    const s = q.toLowerCase();
    const fields = [course.title, course.name, course.description, course.summary, (course.tags && course.tags.join(' '))];
    return fields.some(f => f && String(f).toLowerCase().includes(s));
  }

  const filteredCourses = Array.isArray(courses) ? courses.filter(c => matchesQuery(c, debouncedQuery)) : [];

  function getCourseMetric(course, key) {
    switch (key) {
      case 'name':
        return String(course.title ?? course.name ?? '').toLowerCase();
      case 'rating':
        return Number(course.averageRating ?? course.avgRating ?? course.rating ?? 0);
      case 'difficulty':
        return Number(course.averageDifficulty ?? course.avgDifficulty ?? course.difficulty ?? 0);
      case 'workload':
        return Number(course.averageWorkload ?? course.avgWorkload ?? course.workload ?? 0);
      case 'reviews':
        return Number(course.reviewCount ?? course.reviews ?? 0);
      default:
        return 0;
    }
  }

  const sortedCourses = Array.isArray(filteredCourses) ? [...filteredCourses].sort((a, b) => {
    const va = getCourseMetric(a, sortBy);
    const vb = getCourseMetric(b, sortBy);
    const dir = sortDir === 'asc' ? 1 : -1;
    // string compare for name
    if (sortBy === 'name') {
      return String(va).localeCompare(String(vb)) * dir;
    }
    // numeric compare
    const na = Number(va ?? 0);
    const nb = Number(vb ?? 0);
    return (na - nb) * dir;
  }) : [];

  function formatNumber(n, decimals = 2) {
    if (n === undefined || n === null) return 'N/A';
    const num = Number(n);
    if (Number.isNaN(num)) return 'N/A';
    let s = num.toFixed(decimals);
    // trim trailing zeros and optional dot
    s = s.replace(/\.0+$|(?<=\.[0-9]*?)0+$/g, '').replace(/\.$/, '');
    return s;
  }

  function formatDateTaken(v) {
    if (!v) return null;
    // accept number (seconds or ms) or ISO date string
    const n = Number(v);
    let d;
    if (!Number.isNaN(n)) {
      // numeric — assume seconds if < 1e12
      const ms = n < 1e12 ? n * 1000 : n;
      d = new Date(ms);
    } else {
      d = new Date(String(v));
    }
    if (Number.isNaN(d.getTime())) return null;
    return d.toLocaleString(undefined, { year: 'numeric', month: 'long' });
  }

  function selectCourse(course) {
    setSelectedCourse(course);
    setCourseReviews(null);
    setCourseReviewsError(null);
    setCourseReviewsLoading(true);
    setShowModal(true);

    const id = course.courseId
    fetch(`http://localhost:8080/api/reviews/${encodeURIComponent(id)}`)
      .then(async (resp) => {
        if (!resp.ok) throw new Error(`Request failed: ${resp.status} ${resp.statusText}`);
        const data = await resp.json();
        return data;
      })
      .then((data) => setCourseReviews(Array.isArray(data) ? data : []))
      .catch((err) => setCourseReviewsError(err.message || 'Unknown error'))
      .finally(() => setCourseReviewsLoading(false));
  }

  async function submitReview(e) {
    e.preventDefault();
    setFormError(null);
    // require a selected course and use its id
    const courseId = selectedCourse?.courseId;
    if (!courseId) {
      setFormError('Please select a course before submitting a review');
      return;
    }
    // default reviewer name to 'Anonymous' when cleared
    const reviewerName = formState.reviewerName?.trim() || 'Anonymous';
    setFormSubmitting(true);
    try {
      const payload = {
        courseId,
        reviewerName,
        comment: formState.comment,
        rating: Number(formState.rating),
        difficulty: Number(formState.difficulty),
        workload: formState.workload,
        date_taken: (new Date(formState.date_taken).getTime()) / 1000 || null
      };
      const resp = await fetch('http://localhost:8080/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (!resp.ok) throw new Error(`Request failed: ${resp.status} ${resp.statusText}`);
      // On success, re-fetch reviews for the current selected course
      if (selectedCourse) {
        selectCourse(selectedCourse);
      }
      // reset form
  setShowReviewForm(false);
  setFormState({ reviewerName: 'Anonymous', difficulty: 3, workload: '', date_taken: '', rating: 5, comment: 'This course is amazing' });
    } catch (err) {
      setFormError(err.message || 'Failed to submit review');
    } finally {
      setFormSubmitting(false);
    }
  }

  return (
    <section id="courses" className="section">
      <h2>Course Reviews</h2>
      {loading && <p className="muted">Loading courses…</p>}
      {error && <p className="error">Error: {error}</p>}

      {!loading && !error && courses == null && (
        <div>
          <p>No courses loaded.</p>
        </div>
      )}

      {!loading && !error && Array.isArray(courses) && (
        <div className="courses-container">
          <div className="courses-left">
            <div style={{ marginBottom: 12, display: 'flex', gap: 8, alignItems: 'center' }}>
              <input className="input" placeholder="Search courses (title, description, tags)" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
              {searchQuery && <button className="btn" onClick={() => setSearchQuery('')}>Clear</button>}
              <div className="sort-controls" style={{ marginLeft: 'auto', display: 'flex', gap: 8, alignItems: 'center' }}>
                <label style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  <span style={{ fontSize: '0.9rem', color: '#444' }}>Sort</span>
                  <select className="sort-select" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                    <option value="name">Name</option>
                    <option value="rating">Avg Rating</option>
                    <option value="difficulty">Avg Difficulty</option>
                    <option value="workload">Avg Workload</option>
                    <option value="reviews"># Reviews</option>
                  </select>
                </label>
                <button className="btn sort-dir" onClick={() => setSortDir(d => d === 'asc' ? 'desc' : 'asc')}>{sortDir === 'asc' ? '↑' : '↓'}</button>
              </div>
            </div>

            <div className="courses-list">
              {courses.length === 0 && <p>No courses found.</p>}
              {sortedCourses.length === 0 && <p>No matching courses.</p>}
              {sortedCourses.map((c, i) => (
              <article
                key={c.id ?? i}
                className={`course-card ${selectedCourse && (selectedCourse.id ?? selectedCourse._id ?? selectedCourse.name) === (c.id ?? c._id ?? c.name) ? 'selected' : ''}`}
                onClick={() => selectCourse(c)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => { if (e.key === 'Enter') selectCourse(c); }}
              >
                <h3 className="course-title">{c.title || c.name || `Course ${i + 1}`}</h3>
                <p className="course-desc">{c.description || c.summary || ''}</p>
                <div style={{ marginTop: 8, display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
                  <span className="badge">{c.courseId }</span>
                  <span className="badge"># Reviews: {c.reviewCount ?? c.reviews ?? 0}</span>
                  <span className="badge">Avg Rating: {formatNumber(c.averageRating ?? c.avgRating ?? c.rating)} / 5</span>
                  <span className="badge">Avg Difficulty: {formatNumber(c.averageDifficulty ?? c.avgDifficulty ?? c.difficulty)} / 5</span>
                  <span className="badge">Avg Workload: {formatNumber(c.averageWorkload ?? c.avgWorkload ?? c.workload)} hrs</span>
                </div>
              </article>
            ))}
          </div>

          {/* Modal will show reviews when a course is selected */}
          </div>
        </div>
      )}

      {showModal && selectedCourse && (
        <div className="modal-overlay" role="dialog" aria-modal="true">
          <div className="modal">
            <button className="modal-close" onClick={() => { setShowModal(false); setSelectedCourse(null); }} aria-label="Close">×</button>
            <div className="modal-content">
              <h3>{selectedCourse.title || selectedCourse.name}</h3>
              <p>{selectedCourse.description || selectedCourse.summary || 'No description provided.'}</p>
              <div style={{ marginTop: 8, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                <span className="badge">{selectedCourse.courseId}</span>
                <span className="badge"># Reviews: {selectedCourse.reviewCount ?? selectedCourse.reviews ?? 'N/A'}</span>
                <span className="badge">Avg Rating: {formatNumber(selectedCourse.averageRating ?? selectedCourse.avgRating ?? selectedCourse.rating)} / 5</span>
                <span className="badge">Avg Difficulty: {formatNumber(selectedCourse.averageDifficulty ?? selectedCourse.avgDifficulty ?? selectedCourse.difficulty)} / 5</span>
                <span className="badge">Avg Workload: {formatNumber(selectedCourse.averageWorkload ?? selectedCourse.avgWorkload ?? selectedCourse.workload)} hrs</span>
              </div>

              <div className="course-reviews">
                <h4>Reviews for this course</h4>
                {courseReviewsLoading && <p className="muted">Loading reviews…</p>}
                {courseReviewsError && <p className="error">Error: {courseReviewsError}</p>}
                <div style={{ marginTop: 8 }}>
                  <button className="btn" onClick={() => setShowReviewForm((s) => !s)}>{showReviewForm ? 'Cancel' : 'Add a review'}</button>
                </div>

                {showReviewForm && (
                  <form className="review-form" onSubmit={submitReview}>
                    <label>
                      Your name
                      <input value={formState.reviewerName} onChange={(e) => setFormState((s) => ({ ...s, reviewerName: e.target.value }))} />
                    </label>
                    <label>
                      Difficulty (1-5)
                      <input type="number" min={1} max={5} value={formState.difficulty} onChange={(e) => setFormState((s) => ({ ...s, difficulty: e.target.value }))} />
                    </label>
                    <label>
                      Workload per week (hours)
                      <input value={formState.workload} onChange={(e) => setFormState((s) => ({ ...s, workload: e.target.value }))} />
                    </label>
                    <label>
                      Date taken
                      <input type="date" value={formState.date_taken} onChange={(e) => setFormState((s) => ({ ...s, date_taken: e.target.value }))} />
                    </label>
                    <label>
                      Rating (1-5)
                      <input type="number" min={1} max={5} value={formState.rating} onChange={(e) => setFormState((s) => ({ ...s, rating: e.target.value }))} />
                    </label>
                    <label>
                      Comment
                      <textarea value={formState.comment} onChange={(e) => setFormState((s) => ({ ...s, comment: e.target.value }))} />
                    </label>
                    {formError && <p className="error">{formError}</p>}
                    <div>
                      <button className="btn primary" type="submit" disabled={formSubmitting}>{formSubmitting ? 'Submitting…' : 'Submit review'}</button>
                    </div>
                  </form>
                )}

                {!courseReviewsLoading && !courseReviewsError && Array.isArray(courseReviews) && (
                  <div className="reviews-list">
                    {courseReviews.length === 0 && <p>No reviews for this course yet.</p>}
                    {courseReviews.map((r, i) => {
                      const createdTs = r.created ? Number(r.created) * 1000 : null;
                      const createdDate = createdTs ? new Date(createdTs).toLocaleString() : null;
                      const rating = r.rating ?? r.score ?? null;
                      return (
                        <article key={r.reviewId ?? r.id ?? i} className="review-card">
                          <div className="review-head">
                            <div>
                              <div className="reviewer-name">{r.reviewerName || r.author || 'Anonymous'}</div>
                              {createdDate && <div className="review-created">{createdDate}</div>}
                            </div>
                            <div className="review-stats">
                              {rating != null && (
                                <div className="review-rating" aria-label={`Rating ${rating}`}>
                                  {Array.from({ length: Math.max(0, Math.min(5, Math.round(rating))) }).map((_, k) => (
                                    <span key={k}>⭐</span>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>

                          <div className="review-comment">{r.comment || r.body || r.content || ''}</div>

                          <div className="review-meta">
                            <span className="badge">Difficulty: {r.difficulty ?? 'N/A'} / 5</span>
                            <span className="badge">Workload: {r.workload ?? 'N/A'} hrs / week</span>
                            {(() => {
                              const taken = r.date_taken ?? r.dateTaken ?? r.taken ?? r.takenDate ?? null;
                              const fmt = formatDateTaken(taken);
                              return fmt ? <span className="badge">Taken on: {fmt}</span> : null;
                            })()}
                          </div>
                        </article>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
