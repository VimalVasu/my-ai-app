'use client'

import { createClient } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import type { User } from '@supabase/supabase-js'

export default function Auth() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState({
    signUp: false,
    signIn: false,
    signOut: false
  })
  const [user, setUser] = useState<User | null>(null)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    // Check current session
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      setUser(session?.user ?? null)
    }

    checkUser()

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [supabase.auth])

  const handleSignUp = async () => {
    setIsLoading(prev => ({ ...prev, signUp: true }))
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
      })
      if (error) {
        alert(error.message)
      } else {
        alert('Check your email for the confirmation link!')
        router.refresh()
      }
    } finally {
      setIsLoading(prev => ({ ...prev, signUp: false }))
    }
  }

  const handleSignIn = async () => {
    setIsLoading(prev => ({ ...prev, signIn: true }))
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      if (error) {
        alert(error.message)
      } else {
        setEmail('')
        setPassword('')
        router.refresh()
      }
    } finally {
      setIsLoading(prev => ({ ...prev, signIn: false }))
    }
  }

  const handleSignOut = async () => {
    setIsLoading(prev => ({ ...prev, signOut: true }))
    try {
      const { error } = await supabase.auth.signOut()
      if (error) {
        alert(error.message)
      } else {
        setUser(null)
        router.refresh()
      }
    } finally {
      setIsLoading(prev => ({ ...prev, signOut: false }))
    }
  }

  return (
    <div className="flex flex-col gap-4 p-4">
      {!user ? (
        <>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <div className="flex gap-2">
            <button
              onClick={handleSignUp}
              disabled={isLoading.signUp}
              className="px-4 py-2 bg-blue-500 text-white rounded transition-all duration-200 
                hover:bg-blue-600 active:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed
                focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              {isLoading.signUp ? 'Signing up...' : 'Sign Up'}
            </button>
            <button
              onClick={handleSignIn}
              disabled={isLoading.signIn}
              className="px-4 py-2 bg-green-500 text-white rounded transition-all duration-200 
                hover:bg-green-600 active:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed
                focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
            >
              {isLoading.signIn ? 'Signing in...' : 'Sign In'}
            </button>
          </div>
        </>
      ) : (
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Signed in as {user.email}</span>
          <button
            onClick={handleSignOut}
            disabled={isLoading.signOut}
            className="px-4 py-2 bg-red-500 text-white rounded transition-all duration-200 
              hover:bg-red-600 active:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed
              focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
          >
            {isLoading.signOut ? 'Signing out...' : 'Sign Out'}
          </button>
        </div>
      )}
    </div>
  )
} 