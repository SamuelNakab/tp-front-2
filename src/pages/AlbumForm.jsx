import { useState, useEffect, useRef } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'
import { useAuth } from '../context/AuthContext'

const GENRES = [
  'Rock', 'Pop', 'Jazz', 'Blues', 'Soul', 'R&B',
  'Hip-Hop', 'Electrónica', 'Clásica', 'Reggae',
  'Folk', 'Metal', 'Punk', 'Funk', 'Indie',
  'Latin', 'Country', 'Bossa Nova',
]

const NOTES = ['♩', '♪', '♫', '♬', '𝄞', '♭', '♮', '𝄝']

// ─── Animación de notas musicales ────────────────
function NoteBurst({ active, onDone }) {
  const [notes, setNotes] = useState([])

  useEffect(() => {
    if (!active) return
    const count = 32
    const generated = Array.from({ length: count }, (_, i) => {
      // Distribuir en olas: primera ola rápida, segunda más lenta
      const wave = i < 18 ? 0 : 1
      const angleBase = (i / (wave === 0 ? 18 : 14)) * 360
      const angle = angleBase + (Math.random() * 28 - 14)
      const rad = (angle * Math.PI) / 180
      const dist = wave === 0
        ? 220 + Math.random() * 200   // primera ola: lejos
        : 130 + Math.random() * 130   // segunda ola: media distancia
      const dx = Math.cos(rad) * dist
      const dy = Math.sin(rad) * dist
      const rot0 = Math.random() * 60 - 30
      const rot1 = rot0 + (Math.random() * 120 - 60)
      const dur = wave === 0
        ? 0.75 + Math.random() * 0.35
        : 0.9  + Math.random() * 0.4
      const delay = wave === 0
        ? Math.random() * 0.08
        : 0.04 + Math.random() * 0.12
      const size = wave === 0
        ? 22 + Math.random() * 20   // notas grandes en primera ola
        : 16 + Math.random() * 14
      // colores variados
      const colorRoll = Math.random()
      const color = colorRoll < 0.5
        ? 'var(--accent)'
        : colorRoll < 0.8
        ? 'var(--warm2)'
        : '#ffffff'
      return {
        id: i,
        symbol: NOTES[Math.floor(Math.random() * NOTES.length)],
        dx: `${dx}px`,
        dy: `${dy}px`,
        rot0: `${rot0}deg`,
        rot1: `${rot1}deg`,
        dur: `${dur}s`,
        delay: `${delay}s`,
        size,
        color,
      }
    })
    setNotes(generated)
    const timeout = setTimeout(() => {
      setNotes([])
      onDone()
    }, 1500)
    return () => clearTimeout(timeout)
  }, [active])

  if (!notes.length) return null

  return (
    <div className="note-burst" aria-hidden="true">
      {notes.map(n => (
        <span
          key={n.id}
          className="note"
          style={{
            '--dx': n.dx,
            '--dy': n.dy,
            '--rot0': n.rot0,
            '--rot1': n.rot1,
            '--dur': n.dur,
            animationDelay: n.delay,
            fontSize: `${n.size}px`,
            color: n.color,
            left: '50%',
            top: '50%',
          }}
        >
          {n.symbol}
        </span>
      ))}
    </div>
  )
}

// ─── StarPicker ───────────────────────────────────
function StarPicker({ value, onChange }) {
  const [hovered, setHovered] = useState(0)
  return (
    <span className="star-picker">
      {[1, 2, 3, 4, 5].map(n => (
        <button
          key={n}
          type="button"
          className={`star-btn ${n <= (hovered || value) ? 'active' : ''}`}
          onMouseEnter={() => setHovered(n)}
          onMouseLeave={() => setHovered(0)}
          onClick={() => onChange(n)}
          aria-label={`${n} estrella${n > 1 ? 's' : ''}`}
        >
          ★
        </button>
      ))}
    </span>
  )
}

// ─── GenrePicker ──────────────────────────────────
function GenrePicker({ value, onChange }) {
  const isCustom = value && !GENRES.includes(value)
  const [showCustom, setShowCustom] = useState(isCustom)
  const [customVal, setCustomVal] = useState(isCustom ? value : '')

  function selectChip(genre) {
    setShowCustom(false)
    setCustomVal('')
    onChange(genre)
  }

  function toggleOtro() {
    const next = !showCustom
    setShowCustom(next)
    if (!next) {
      onChange(value && GENRES.includes(value) ? value : '')
    } else {
      onChange(customVal)
    }
  }

  function handleCustom(e) {
    setCustomVal(e.target.value)
    onChange(e.target.value)
  }

  return (
    <div className="genre-picker">
      <div className="genre-chips">
        {GENRES.map(g => (
          <button
            key={g}
            type="button"
            className={`genre-chip ${value === g && !showCustom ? 'active' : ''}`}
            onClick={() => selectChip(g)}
          >
            {g}
          </button>
        ))}
        <button
          type="button"
          className={`genre-chip genre-chip-otro ${showCustom ? 'active' : ''}`}
          onClick={toggleOtro}
        >
          + Otro
        </button>
      </div>
      {showCustom && (
        <input
          className="genre-custom-input"
          placeholder="Escribí el género…"
          value={customVal}
          onChange={handleCustom}
          autoFocus
        />
      )}
    </div>
  )
}

const EMPTY = { title: '', artist: '', genre: '', year: '', rating: 0, review: '', cover_url: '' }

export default function AlbumForm() {
  const { id } = useParams()
  const isEditing = Boolean(id)
  const navigate = useNavigate()
  const { session } = useAuth()

  const [form, setForm] = useState(EMPTY)
  const [coverFile, setCoverFile] = useState(null)
  const [coverPreview, setCoverPreview] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [fetchingAlbum, setFetchingAlbum] = useState(isEditing)

  // Nota burst
  const [burst, setBurst] = useState(false)
  const pendingNav = useRef(false)

  useEffect(() => {
    if (!isEditing) return
    async function loadAlbum() {
      const { data, error } = await supabase
        .from('albums')
        .select('*')
        .eq('id', id)
        .eq('user_id', session.user.id)
        .single()
      if (error || !data) { navigate('/'); return }
      setForm(data)
      if (data.cover_url) setCoverPreview(data.cover_url)
      setFetchingAlbum(false)
    }
    loadAlbum()
  }, [id, isEditing, session, navigate])

  function handleField(e) {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  function handleFileChange(e) {
    const file = e.target.files[0]
    if (!file) return
    setCoverFile(file)
    setCoverPreview(URL.createObjectURL(file))
  }

  async function uploadCover() {
    const path = `${session.user.id}/${Date.now()}_${coverFile.name}`
    const { error } = await supabase.storage.from('covers').upload(path, coverFile, { upsert: true })
    if (error) throw error
    const { data } = supabase.storage.from('covers').getPublicUrl(path)
    return data.publicUrl
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      let cover_url = form.cover_url
      if (coverFile) cover_url = await uploadCover()

      const payload = {
        title: form.title,
        artist: form.artist,
        genre: form.genre,
        year: form.year ? Number(form.year) : null,
        rating: Number(form.rating),
        review: form.review,
        cover_url,
        user_id: session.user.id,
      }

      if (isEditing) {
        const { error } = await supabase.from('albums').update(payload).eq('id', id)
        if (error) throw error
        // editar no tiene burst, navega directo
        navigate('/')
      } else {
        const { error } = await supabase.from('albums').insert(payload)
        if (error) throw error
        // disparar burst y luego navegar
        pendingNav.current = true
        setBurst(true)
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  async function handleDelete() {
    if (!window.confirm('¿Eliminar este álbum?')) return
    await supabase.from('albums').delete().eq('id', id)
    navigate('/')
  }

  function handleBurstDone() {
    setBurst(false)
    if (pendingNav.current) {
      pendingNav.current = false
      navigate('/')
    }
  }

  if (fetchingAlbum) return <div className="page-loading">Cargando álbum</div>

  return (
    <>
      <NoteBurst active={burst} onDone={handleBurstDone} />

      <div className="form-page">
        <div className="form-container">
          <div className="form-header">
            <button type="button" className="btn-back" onClick={() => navigate('/')}>
              ← Volver
            </button>
            <h2>{isEditing ? 'Editar álbum' : 'Nuevo álbum'}</h2>
          </div>

          <form onSubmit={handleSubmit} className="album-form">
            <div className="form-grid">
              <label>
                Título *
                <input name="title" value={form.title} onChange={handleField} required placeholder="nombre del álbum" />
              </label>
              <label>
                Artista *
                <input name="artist" value={form.artist} onChange={handleField} required placeholder="nombre del artista" />
              </label>
              <label>
                Año
                <input name="year" type="number" min="1900" max="2099" value={form.year} onChange={handleField} placeholder="1973" />
              </label>
            </div>

            <div className="label-block">
              Género
              <GenrePicker
                value={form.genre}
                onChange={val => setForm(prev => ({ ...prev, genre: val }))}
              />
            </div>

            <label className="label-block">
              Rating
              <StarPicker value={form.rating} onChange={val => setForm(prev => ({ ...prev, rating: val }))} />
            </label>

            <label className="label-block">
              Reseña
              <textarea
                name="review"
                value={form.review}
                onChange={handleField}
                rows={4}
                placeholder="Tu opinión sobre el álbum…"
              />
            </label>

            <label className="label-block">
              Portada
              <div className="cover-upload">
                {coverPreview && (
                  <img className="cover-preview" src={coverPreview} alt="Previsualización" />
                )}
                <input type="file" accept="image/*" onChange={handleFileChange} />
              </div>
            </label>

            {error && <p className="auth-error">{error}</p>}

            <div className="form-footer">
              {isEditing && (
                <button type="button" className="btn-delete" onClick={handleDelete}>
                  Eliminar
                </button>
              )}
              <button type="submit" className="btn-primary" disabled={loading}>
                {loading ? 'Guardando…' : isEditing ? 'Guardar cambios' : '✦ Crear álbum'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  )
}