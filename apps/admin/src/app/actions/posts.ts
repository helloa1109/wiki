'use server'

import { revalidatePath } from 'next/cache'
import { createAdminClient } from '@/lib/supabase/admin'
import { createClient } from '@/lib/supabase/server'

export interface PostPayload {
  title: string
  content: string | null
  thumbnail_url: string | null
  tags: string[]
  published: boolean
}

export async function createPost(payload: PostPayload) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const admin = createAdminClient()
  const { error } = await admin.from('posts').insert({
    ...payload,
    author_id: user?.id ?? null,
  })
  if (error) throw new Error(error.message)
  revalidatePath('/posts')
}

export async function updatePost(id: string, payload: PostPayload) {
  const admin = createAdminClient()
  const { error } = await admin.from('posts').update({ ...payload, updated_at: new Date().toISOString() }).eq('id', id)
  if (error) throw new Error(error.message)
  revalidatePath('/posts')
}

export async function deletePost(id: string) {
  const admin = createAdminClient()
  const { error } = await admin.from('posts').delete().eq('id', id)
  if (error) throw new Error(error.message)
  revalidatePath('/posts')
}

export async function togglePublish(id: string, published: boolean) {
  const admin = createAdminClient()
  const { error } = await admin.from('posts').update({ published, updated_at: new Date().toISOString() }).eq('id', id)
  if (error) throw new Error(error.message)
  revalidatePath('/posts')
}
