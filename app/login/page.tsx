'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()
  const supabase = createClient()
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const { error: signInError } = await supabase.auth.signInWithPassword({ email, password })
    if (signInError) { setError(signInError.message); setLoading(false); return }
    router.push('/dashboard')
  }
  return <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4"><div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8"><h1 className="text-2xl font-bold text-center">Welcome back</h1><form onSubmit={handleSubmit} className="space-y-4 mt-6">{error && <p className="text-red-500 text-sm">{error}</p>}<input className="w-full border p-2 rounded" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} /><input className="w-full border p-2 rounded" placeholder="Password" type="password" value={password} onChange={e=>setPassword(e.target.value)} /><button disabled={loading} className="w-full bg-sky-500 text-white p-2 rounded">{loading?'Loading...':'Login'}</button></form></div></div>
}
