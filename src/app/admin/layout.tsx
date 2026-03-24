import React from 'react'
import Link from 'next/link'
import { auth, currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const { userId } = await auth()

  if (!userId) {
    redirect('/sign-in')
  }

  const user = await currentUser()
  const isAdmin = user?.publicMetadata?.role === 'admin'

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center p-8 bg-white border border-gray-200 max-w-md">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h1>
          <p className="text-gray-500 mb-4">You do not have admin permissions.</p>
          <Link href="/" className="text-sm font-bold text-green-700 hover:underline">
            ← Back to site
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Admin Nav */}
      <nav className="bg-gray-900 text-white px-6 py-4 flex items-center gap-6">
        <span className="font-black text-lg tracking-tight">MUOROTO CMS</span>
        <div className="flex gap-4 ml-4">
          <Link
            href="/admin"
            className="text-sm font-semibold text-gray-300 hover:text-white transition-colors"
          >
            Dashboard
          </Link>
          <Link
            href="/admin/presenters"
            className="text-sm font-semibold text-gray-300 hover:text-white transition-colors"
          >
            Presenters
          </Link>
          <Link
            href="/admin/programs"
            className="text-sm font-semibold text-gray-300 hover:text-white transition-colors"
          >
            Programs
          </Link>
          <Link
            href="/admin/news"
            className="text-sm font-semibold text-gray-300 hover:text-white transition-colors"
          >
            News
          </Link>
          <Link
            href="/admin/content"
            className="text-sm font-semibold text-gray-300 hover:text-white transition-colors border-l border-white/20 pl-4 ml-4"
          >
            Content
          </Link>
        </div>
        <div className="ml-auto">
          <Link
            href="/"
            className="text-xs text-gray-400 hover:text-white transition-colors"
          >
            ← View Site
          </Link>
        </div>
      </nav>

      {/* Content */}
      <main className="max-w-5xl mx-auto px-6 py-10">{children}</main>
    </div>
  )
}
