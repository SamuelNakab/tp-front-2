import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'
import { useAuth } from '../context/AuthContext'

export default function Home() {
  const { session } = useAuth()
  const navigate = useNavigate()

  async function handleLogout() {
    await supabase.auth.signOut()
    navigate('/login')
  }

  return (
    <div className="home-container">
      <h1>Mi catálogo musical</h1>
      <p>Bienvenido, {session?.user?.email}</p>
      <button onClick={handleLogout}>Cerrar sesión</button>
    </div>
  )
}
