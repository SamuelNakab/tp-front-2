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

  if (loading) return <div className="page-loading">Cargando…</div>

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>Mi catálogo</h1>
        <div className="dashboard-actions">
          <button className="btn-primary" onClick={() => navigate('/new')}>
            + Agregar álbum
          </button>
          <button className="btn-logout" onClick={handleLogout}>
            Cerrar sesión
          </button>
        </div>
      </header>

      {albums.length === 0 ? (
        <div className="empty-state">
          <p className="empty-icon">♪</p>
          <p>No tenés álbumes todavía.</p>
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
                {album.cover_url ? (
                  <img src={album.cover_url} alt={`Portada de ${album.title}`} />
                ) : (
                  <div className="cover-placeholder">♪</div>
                )}
              </div>
              <div className="album-info">
                <h3 className="album-title">{album.title}</h3>
                <p className="album-artist">{album.artist}</p>
                <p className="album-meta">
                  {[album.genre, album.year].filter(Boolean).join(' · ')}
                </p>
                {album.rating > 0 && <Stars rating={album.rating} />}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
