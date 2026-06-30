'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function DeleteButton({ id, adminKey }: { id: number; adminKey: string }) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleDelete() {
    if (!confirm('确定删除这个频道及其所有剧集？')) return
    setLoading(true)
    await fetch(`/api/admin/delete-channel?id=${id}&key=${adminKey}`, { method: 'DELETE' })
    router.refresh()
    setLoading(false)
  }

  return (
    <button
      onClick={handleDelete}
      disabled={loading}
      className="px-3 py-1 rounded-lg text-xs font-medium text-red-500 hover:bg-red-50 border border-red-100 transition-colors disabled:opacity-40">
      {loading ? '删除中...' : '删除'}
    </button>
  )
}
