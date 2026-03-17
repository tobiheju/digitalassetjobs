'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { PageWrapper } from '@/components/layout/page-wrapper'
import {
  getAllPosts,
  getFeaturedPosts,
  getAuthorById,
  formatBlogDate,
  TOPIC_LABELS,
  TOPIC_COLORS,
} from '@/lib/blog'
import { listContainer, listItem } from '@/lib/motion'

export default function BlogPage() {
  const allPosts = getAllPosts()
  const featured = getFeaturedPosts(1)[0]
  const remaining = allPosts.filter((p) => p.id !== featured?.id)

  return (
    <PageWrapper>
      <div className="mx-auto max-w-5xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-serif text-3xl font-normal text-[#1a365d]">Research & Insights</h1>
          <p className="mt-2 text-sm text-slate-500">
            Market analysis, salary reports, and career guidance for digital asset professionals.
          </p>
        </div>

        {/* Featured post */}
        {featured && (
          <Link
            href={`/blog/${featured.slug}`}
            className="group mb-10 block overflow-hidden rounded-2xl border border-slate-100/60 bg-white transition-[border-color,box-shadow] duration-150 ease-out hover:border-slate-200/60 hover:shadow-[0_8px_32px_-8px_rgba(0,0,0,0.1)]"
          >
            <div className="flex flex-col md:flex-row">
              {featured.image && (
                <div className="aspect-[16/9] w-full overflow-hidden md:aspect-auto md:w-2/5">
                  <img
                    src={featured.image}
                    alt={featured.title}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
              )}
              <div className="flex flex-1 flex-col justify-center p-6 md:p-8">
                <div className="mb-3 flex items-center gap-2">
                  <span className={`inline-flex rounded-full border px-2.5 py-0.5 text-[11px] font-medium ${TOPIC_COLORS[featured.topic]}`}>
                    {TOPIC_LABELS[featured.topic]}
                  </span>
                  <span className="text-xs text-slate-400">{formatBlogDate(featured.publishedAt)}</span>
                </div>
                <h2 className="text-xl font-normal leading-snug text-[#1a365d] group-hover:text-[#2c5282] md:text-2xl">
                  {featured.title}
                </h2>
                <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-slate-500">
                  {featured.excerpt}
                </p>
                <div className="mt-4">
                  <span className="text-[13px] font-medium text-[#1a365d]">
                    Read article →
                  </span>
                </div>
              </div>
            </div>
          </Link>
        )}

        {/* Post grid */}
        <motion.div variants={listContainer} initial="hidden" animate="show" className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {remaining.map((post) => {
            const author = getAuthorById(post.authorId)
            return (
              <motion.div key={post.id} variants={listItem}>
              <Link
                href={`/blog/${post.slug}`}
                className="group flex flex-col overflow-hidden rounded-xl border border-slate-100/60 bg-white transition-[border-color,box-shadow] duration-150 ease-out hover:border-slate-200/60 hover:shadow-[0_4px_24px_-6px_rgba(0,0,0,0.08)]"
              >
                {post.image && (
                  <div className="aspect-[16/9] overflow-hidden">
                    <img
                      src={post.image}
                      alt={post.title}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                )}
                <div className="flex flex-1 flex-col p-4">
                  <div className="mb-2 flex items-center gap-2">
                    <span className={`inline-flex rounded-full border px-2 py-0.5 text-[10px] font-medium ${TOPIC_COLORS[post.topic]}`}>
                      {TOPIC_LABELS[post.topic]}
                    </span>
                  </div>
                  <h3 className="text-[15px] font-medium leading-snug text-[#1a365d] group-hover:text-[#2c5282]">
                    {post.title}
                  </h3>
                  <p className="mt-1.5 line-clamp-2 text-[13px] leading-relaxed text-slate-500">
                    {post.excerpt}
                  </p>
                  <div className="mt-auto flex items-center gap-2 pt-4 text-xs text-slate-400">
                    {author && <span>{author.name}</span>}
                    <span>·</span>
                    <span>{formatBlogDate(post.publishedAt)}</span>
                  </div>
                </div>
              </Link>
              </motion.div>
            )
          })}
        </motion.div>
      </div>
    </PageWrapper>
  )
}
