'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function SignupPage() {
  const [clinicName, setClinicName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()
  const supabase = createClient()

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const { data, error: signUpError } = await supabase.auth.signUp({ email, password })
      if (signUpError) throw signUpError
      if (data.user) {
        const { data: org } = await supabase.from('organizations').insert({ name: clinicName }).select().single()
        if (org) {
          await supabase.from('profiles').insert({ id: data.user.id, organization_id: org.id, email, role: 'owner' })
        }
        router.push('/login')
      }
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-slate-100 p-8">
        <div className="flex justify-center mb-6">
          <div className="w-14 h-14 bg-sky-500 rounded-2xl flex items-center justify-center text-2xl">🦷</div>
        </div>
        <h1 className="text-2xl font-bold text-center text-slate-900">Welcome to ANDEZ</h1>
        <p className="text-center text-sm text-slate-500 mt-1">Dental Practice Management</p>
        <div className="mt-6 mb-6">
          <h2 className="text-lg font-semibold text-slate-900">Create your clinic account</h2>
          <p className="text-sm text-slate-500">Start managing your patients today</p>
        </div>
        <form onSubmit={handleSignup} className="space-y-4">
          <div>
            <label className="text-sm font-medium text-slate-700">Clinic Name</label>
            <input className="w-full mt-1 px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-sky-500 outline-none" placeholder="Smile Dental Clinic" value={clinicName} onChange={e=>setClinicName(e.target.value)} required />
          </div>
          <div>
            <label className="text-sm font-medium text-slate-700">Work Email</label>
            <input className="w-full mt-1 px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-sky-500 outline-none" placeholder="doctor@clinic.com" type="email" value={email} onChange={e=>setEmail(e.target.value)} required />
          </div>
          <div>
            <label className="text-sm font-medium text-slate-700">Password</label>
            <input className="w-full mt-1 px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-sky-500 outline-none" placeholder="Min. 6 characters" type="password" value={password} onChange={e=>setPassword(e.target.value)} required />
          </div>
          {error && <p className="text-sm text-red-600 bg-red-50 p-2 rounded-lg">{error}</p>}
          <button type="submit" disabled={loading} className="w-full bg-sky-500 text-white rounded-xl py-3 font-semibold hover:bg-sky-600 shadow-sm disabled:opacity-50">
            {loading ? 'Creating...' : 'Create Clinic Account'}
          </button>
        </form>
        <p className="text-center text-sm text-slate-500 mt-6">Already have an account? <a href="/login" className="text-sky-600 font-medium">Log in</a></p>
      </div>
    </div>
  )
}
