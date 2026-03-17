import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { PageWrapper } from '@/components/layout/page-wrapper'
import { toTitleCase } from '@/lib/utils'
import {
  getPostBySlug,
  getAllPosts,
  getAuthorById,
  formatBlogDate,
  TOPIC_LABELS,
  TOPIC_COLORS,
} from '@/lib/blog'

export async function generateStaticParams() {
  const posts = getAllPosts()
  return posts.map((post) => ({ slug: post.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = getPostBySlug(slug)
  if (!post) return { title: 'Not Found' }
  return {
    title: `${post.title} | Digital Asset Jobs`,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      images: [`/api/og?title=${encodeURIComponent(post.title)}&subtitle=${encodeURIComponent(post.category || 'Blog')}`],
    },
  }
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = getPostBySlug(slug)
  if (!post) notFound()

  const author = getAuthorById(post.authorId)
  const allPosts = getAllPosts()
  const related = allPosts.filter((p) => p.id !== post.id).slice(0, 3)

  // Simple markdown-to-HTML: headings, bold, italic, lists, links, tables, hr
  const contentHtml = post.content
    .split('\n')
    .map((line) => {
      if (line.startsWith('## ')) return `<h2>${line.slice(3)}</h2>`
      if (line.startsWith('### ')) return `<h3>${line.slice(4)}</h3>`
      if (line.startsWith('---')) return '<hr />'
      if (line.startsWith('- **')) return `<li>${line.slice(2)}</li>`
      if (line.startsWith('- ')) return `<li>${line.slice(2)}</li>`
      if (line.startsWith('| ')) return '' // Skip table rows for now
      if (line.trim() === '') return '<br />'
      return `<p>${line}</p>`
    })
    .join('\n')
    // Inline formatting
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/\*([^*]+)\*/g, '<em>$1</em>')

  return (
    <PageWrapper>
      <article className="mx-auto max-w-3xl">
        {/* Back link */}
        <Link
          href="/blog"
          className="mb-6 inline-flex items-center gap-1.5 text-[13px] font-medium text-slate-400 hover:text-[#1a365d]"
        >
          <ArrowLeft className="size-3.5" />
          Back to Blog
        </Link>

        {/* Hero image */}
        {post.image && (
          <div className="mb-6 aspect-[2/1] overflow-hidden rounded-2xl">
            <img
              src={post.image}
              alt={post.title}
              className="h-full w-full object-cover"
            />
          </div>
        )}

        {/* Meta */}
        <div className="mb-4 flex flex-wrap items-center gap-2">
          <span className={`inline-flex rounded-full border px-2.5 py-0.5 text-[11px] font-medium ${TOPIC_COLORS[post.topic]}`}>
            {TOPIC_LABELS[post.topic]}
          </span>
          <span className="text-xs text-slate-400">{formatBlogDate(post.publishedAt)}</span>
          {author && (
            <>
              <span className="text-xs text-slate-300">·</span>
              <span className="text-xs text-slate-500">{author.name}, {author.role}</span>
            </>
          )}
        </div>

        {/* Title */}
        <h1 className="mb-6 text-3xl leading-tight text-[#1a365d] md:text-4xl">
          {post.title}
        </h1>

        {/* Excerpt */}
        <p className="mb-8 text-lg leading-relaxed text-slate-600 border-l-2 border-[#d4a038] pl-4">
          {post.excerpt}
        </p>

        {/* Content */}
        <div
          className="prose prose-slate max-w-none
            prose-headings:font-serif prose-headings:text-[#1a365d] prose-headings:font-normal
            prose-h2:mt-10 prose-h2:mb-4 prose-h2:text-xl
            prose-h3:mt-6 prose-h3:mb-3 prose-h3:text-lg
            prose-p:text-[15px] prose-p:leading-relaxed prose-p:text-slate-600
            prose-strong:text-slate-800
            prose-li:text-[15px] prose-li:text-slate-600
            prose-a:text-[#1a365d] prose-a:underline-offset-2
            prose-hr:border-slate-200"
          dangerouslySetInnerHTML={{ __html: contentHtml }}
        />

        {/* Tags */}
        <div className="mt-10 flex flex-wrap gap-1.5 border-t pt-6">
          {post.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-slate-100 px-2.5 py-0.5 text-[11px] font-medium text-slate-500"
            >
              {toTitleCase(tag)}
            </span>
          ))}
        </div>

        {/* Related posts */}
        {related.length > 0 && (
          <section className="mt-12 border-t pt-8">
            <h2 className="mb-5 text-lg text-[#1a365d]">More from the Blog</h2>
            <div className="grid gap-4 md:grid-cols-3">
              {related.map((p) => (
                <Link
                  key={p.id}
                  href={`/blog/${p.slug}`}
                  className="group rounded-xl border border-slate-100 p-4 transition-shadow hover:shadow-[0_4px_24px_-6px_rgba(0,0,0,0.08)]"
                >
                  <span className={`inline-flex rounded-full border px-2 py-0.5 text-[10px] font-medium ${TOPIC_COLORS[p.topic]}`}>
                    {TOPIC_LABELS[p.topic]}
                  </span>
                  <h3 className="mt-2 line-clamp-2 text-[14px] font-medium leading-snug text-[#1a365d] group-hover:text-[#2c5282]">
                    {p.title}
                  </h3>
                  <p className="mt-1 text-xs text-slate-400">
                    {formatBlogDate(p.publishedAt)}
                  </p>
                </Link>
              ))}
            </div>
          </section>
        )}
      </article>
    </PageWrapper>
  )
}
