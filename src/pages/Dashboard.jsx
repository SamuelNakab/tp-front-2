import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'
import { useAuth } from '../context/AuthContext'

function Stars({ rating }) {
  return (
    <span className="stars" aria-label={`${rating} de 5`}>
      {[1, 2, 3, 4, 5].map(n => (
        <span key={n} className={n <= rating ? 'star filled' : 'star'}>★</span>
      ))}
    </span>
  )
}

// Vinilo SVG como placeholder
function VinylPlaceholder() {
  return (
    <div className="cover-placeholder">
      <span className="cover-placeholder-note">♪</span>
    </div>
  )
}

export default function Dashboard() {
  const { session } = useAuth()
  const navigate = useNavigate()
  const [albums, setAlbums] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchAlbums() {
      const { data, error } = await supabase
        .from('albums')
        .select('*')
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false })
      if (!error) setAlbums(data)
      setLoading(false)
    }
    fetchAlbums()
  }, [session])

  async function handleLogout() {
    await supabase.auth.signOut()
    navigate('/login')
  }

  const avgRating = albums.length
    ? (albums.reduce((acc, a) => acc + (a.rating || 0), 0) / albums.length).toFixed(1)
    : '—'
  const genres = new Set(albums.map(a => a.genre).filter(Boolean)).size

  if (loading) return <div className="page-loading">Cargando colección</div>

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div className="dashboard-logo">
          <span className="dashboard-logo-text">
            <em>Vinilos</em>
          </span>
          <span className="dashboard-logo-sep" />
          <span className="dashboard-logo-sub">tu catálogo</span>
        </div>
        <div className="dashboard-actions">
          <span className="user-email">{session?.user?.email}</span>
          <button className="btn-primary" onClick={() => navigate('/new')}>
            + Nuevo álbum
          </button>
          <button className="btn-logout" onClick={handleLogout}>
            Salir
          </button>
        </div>
      </header>

      <div className="dashboard-body">
        <div className="dashboard-title-row">
          <h1 className="dashboard-title">Mi colección</h1>
          <span className="dashboard-count">
            {albums.length} {albums.length === 1 ? 'álbum' : 'álbumes'}
          </span>
        </div>

        {albums.length > 0 && (
          <div className="stats-bar">
            <div className="stat-item">
              <div className="stat-number">{albums.length}</div>
              <div className="stat-label">Álbumes</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">{genres}</div>
              <div className="stat-label">Géneros</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">{avgRating}</div>
              <div className="stat-label">Rating prom.</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">
                {new Date(albums[0].created_at).getFullYear()}
              </div>
              <div className="stat-label">Último añadido</div>
            </div>
          </div>
        )}

        {albums.length === 0 ? (
          <div className="empty-state">
            <div className="empty-vinyl">
              <div className="empty-vinyl-outer">
                <div className="empty-vinyl-label" />
              </div>
            </div>
            <p>Tu colección está vacía.</p>
            <button className="btn-primary" onClick={() => navigate('/new')}>
              Agregá el primero
            </button>
          </div>
        ) : (
          <div className="album-grid">
            {albums.map(album => (
              <div
                key={album.id}
                className="album-card"
                onClick={() => navigate(`/edit/${album.id}`)}
                role="button"
                tabIndex={0}
                onKeyDown={e => e.key === 'Enter' && navigate(`/edit/${album.id}`)}
              >
                <div className="album-cover">
                  {album.cover_url
                    ? <img src={album.cover_url} alt={`Portada de ${album.title}`} />
                    : <VinylPlaceholder />
                  }
                  {album.genre && (
                    <span className="album-genre-badge">{album.genre}</span>
                  )}
                </div>
                <div className="album-info">
                  <h3 className="album-title">{album.title}</h3>
                  <p className="album-artist">{album.artist}</p>
                  <div className="album-meta-row">
                    <span className="album-year">{album.year || ''}</span>
                    {album.rating > 0 && <Stars rating={album.rating} />}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}