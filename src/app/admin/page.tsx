import Link from 'next/link'
import { prisma } from '@/lib/db'

export default async function AdminDashboard() {
  let presenterCount = 0
  let programCount = 0
  let publishedCount = 0
  let newsCount = 0

  try {
    presenterCount = await prisma.presenter.count()
    programCount = await prisma.program.count()
    publishedCount = await prisma.program.count({ where: { status: 'PUBLISHED' } })
    newsCount = await prisma.news.count()
  } catch (err) {
    console.error('[admin dashboard] DB error:', err)
  }

  return (
    <div>
      <h1 className="text-3xl font-black text-gray-900 mb-2">Dashboard</h1>
      <p className="text-gray-500 mb-8">Manage your radio station content.</p>

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-10">
        <div className="bg-white border border-gray-200 p-6">
          <div className="text-4xl font-black text-gray-900">{presenterCount}</div>
          <div className="text-sm font-semibold text-gray-500 uppercase tracking-wide mt-1">Presenters</div>
        </div>
        <div className="bg-white border border-gray-200 p-6">
          <div className="text-4xl font-black text-gray-900">{programCount}</div>
          <div className="text-sm font-semibold text-gray-500 uppercase tracking-wide mt-1">Programs</div>
        </div>
        <div className="bg-white border border-gray-200 p-6">
          <div className="text-4xl font-black text-brand-yellow font-serif italic text-blue-600">{newsCount}</div>
          <div className="text-sm font-semibold text-gray-500 uppercase tracking-wide mt-1">News Articles</div>
        </div>
        <div className="bg-white border border-gray-200 p-6">
          <div className="text-4xl font-black text-green-700">{publishedCount}</div>
          <div className="text-sm font-semibold text-gray-500 uppercase tracking-wide mt-1">Published Prgms</div>
        </div>
      </div>

      <div className="flex gap-4">
        <Link
          href="/admin/presenters"
          className="bg-gray-900 text-white px-6 py-3 text-sm font-bold uppercase tracking-wide hover:bg-gray-700 transition-colors"
        >
          Manage Presenters
        </Link>
        <Link
          href="/admin/programs"
          className="bg-green-700 text-white px-6 py-3 text-sm font-bold uppercase tracking-wide hover:bg-green-800 transition-colors"
        >
          Manage Programs
        </Link>
        <Link
          href="/admin/news"
          className="bg-blue-600 text-white px-6 py-3 text-sm font-bold uppercase tracking-wide hover:bg-blue-700 transition-colors"
        >
          Manage News
        </Link>
      </div>
    </div>
  )
}
