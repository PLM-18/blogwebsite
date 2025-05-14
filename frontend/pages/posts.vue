<!-- u23629810, Philemon -->
<template>
  <div class="container mx-auto p-4">
    <!-- Single Post View -->
    <div v-if="post && !showAllPosts" class="max-w-3xl mx-auto">
      <div class="mb-6">
        <NuxtLink to="/" class="text-blue-600 hover:underline dark:text-blue-400">
          &larr; Back to all posts
        </NuxtLink>
      </div>
      
      <article class="prose dark:prose-invert max-w-none">
        <h1 class="text-3xl font-bold mb-4">{{ post.title }}</h1>
        
        <div class="flex flex-wrap items-center gap-2 text-sm text-gray-600 dark:text-gray-300 mb-6">
          <div v-if="post.authors && post.authors.length">
            By <span class="font-medium">{{ authorNames(post.authors) }}</span>
          </div>
          
          <div v-if="post.category" class="flex items-center">
            <span class="mx-2">•</span>
            <span class="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
              {{ post.category?.name }}
            </span>
          </div>
          
          <div class="flex items-center">
            <span class="mx-2">•</span>
            <time :datetime="post.publishedAt">{{ formatDate(post.publishedAt) }}</time>
          </div>
        </div>

        <div class="post-content">
          {{ renderContent(post.content) }}
        </div>
      </article>
    </div>

    <!-- All Posts View (when accessed from navbar) -->
    <div v-else-if="showAllPosts">
      <h1 class="text-3xl font-bold mb-6">All Blog Posts</h1>
      
      <div v-if="loading" class="flex justify-center p-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 dark:border-white"></div>
      </div>
      
      <div v-else-if="posts.length" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div 
          v-for="post in posts" 
          :key="post.id" 
          class="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow dark:border-gray-700"
        >
          <NuxtLink :to="`/posts/${post.slug}`" class="block h-full">
            <div class="p-4 h-full flex flex-col">
              <h2 class="text-xl font-semibold mb-2">{{ post.title }}</h2>
              
              <div class="text-sm text-gray-600 dark:text-gray-300 mb-3">
                <span v-if="post.authors && post.authors.length">
                  By {{ authorNames(post.authors) }}
                </span>
                <span v-if="post.category" class="ml-2">
                  in <span class="font-medium">{{ post.category.name }}</span>
                </span>
              </div>
              
              <p class="text-gray-700 dark:text-gray-300 mb-4 flex-grow">
                {{ getContentSnippet(post.content) }}
              </p>
              
              <div class="text-sm text-gray-500 dark:text-gray-400">
                {{ formatDate(post.publishedAt) }}
              </div>
            </div>
          </NuxtLink>
        </div>
      </div>
      
      <div v-else class="text-center py-12">
        <p class="text-xl text-gray-600 dark:text-gray-300">No blog posts found.</p>
      </div>
    </div>

    <!-- Loading State -->
    <div v-else class="flex justify-center p-12">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 dark:border-white"></div>
    </div>
  </div>
</template>

<script setup>
const config = useRuntimeConfig()
const strapiUrl = config.public.strapiUrl
const route = useRoute()
const posts = ref([])
const post = ref(null)
const loading = ref(true)
const showAllPosts = ref(false)

onMounted(async () => {
  try {
    if (!route.params.slug || route.params.slug === 'index') {
      showAllPosts.value = true
      await fetchAllPosts()
    } else {
      await fetchPost(route.params.slug)
    }
  } catch (error) {
    console.error('Error loading data:', error)
  } finally {
    loading.value = false
  }
})

watch(() => route.params.slug, async (newSlug) => {
  loading.value = true
  try {
    if (!newSlug || newSlug === 'index') {
      showAllPosts.value = true
      await fetchAllPosts()
    } else {
      showAllPosts.value = false
      await fetchPost(newSlug)
    }
  } catch (error) {
    console.error('Error on route change:', error)
  } finally {
    loading.value = false
  }
})

async function fetchPost(slug) {
  try {
    const response = await fetch(`${strapiUrl}/api/blog-posts?filters[slug][$eq]=${slug}&populate=category&populate=authors`)
    const data = await response.json()
    
    if (data.data && data.data.length > 0) {
      const postData = data.data[0]
      post.value = {
        id: postData.id,
        title: postData.title,
        slug: postData.slug,
        content: postData.content,
        publishedAt: postData.publishedAt,
        authors: postData.authors?.map(author => ({
          id: author.id,
          name: author.name
        })) || [],
        category: postData.category?.data ? {
          id: postData.category.data.id,
          name: postData.category.data.name,
          slug: postData.category.data.slug
        } : null
      }
    } else {
      post.value = null
    }
  } catch (error) {
    console.error('Error fetching post:', error)
    post.value = null
  }
}

async function fetchAllPosts() {
  try {
    const response = await fetch(`${strapiUrl}/api/blog-posts?populate=category&populate=authors`)
    const data = await response.json()

    posts.value = data.data.map(post => ({
      id: post.id,
      title: post.title,
      slug: post.slug,
      content: post.content,
      publishedAt: post.publishedAt,
      authors: post.authors?.data?.map(author => ({
        id: author.id,
        name: author.name
      })) || [],
      category: post.category?.data ? {
        id: post.category.data.id,
        name: post.category.data.name,
        slug: post.category.data.slug
      } : null
    }))
  } catch (error) {
    console.error('Error fetching all posts:', error)
    posts.value = []
  }
}

function authorNames(authors) {
  if (!authors || !authors.length) return 'Unknown'
  return authors.map(author => author.name).join(', ')
}

function getContentSnippet(content) {
  if (!content) return 'No content available'
  
  if (typeof content === 'object') {
    try {
      const firstTextBlock = Array.isArray(content) 
        ? content.find(block => block.type === 'paragraph' || block.children)
        : content
        
      let text = ''
      if (firstTextBlock) {
        if (firstTextBlock.children) {
          text = firstTextBlock.children
            .filter(child => child.text)
            .map(child => child.text)
            .join(' ')
        } else if (firstTextBlock.text) {
          text = firstTextBlock.text
        }
      }
      
      return text ? `${text.substring(0, 80)}${text.length > 80 ? '...' : ''}` : 'No content available'
    } catch (e) {
      return 'Content preview unavailable'
    }
  }

  return `${content.substring(0, 80)}${content.length > 80 ? '...' : ''}`
}

function renderContent(content) {
  if (!content) return 'No content available'
  
  if (typeof content === 'object') {
    try {
      if (Array.isArray(content)) {
        return content.map(block => {
          if (block.children) {
            return block.children.map(child => child.text || '').join(' ')
          }
          return block.text || ''
        }).join('\n\n')
      } else if (content.children) {
        return content.children.map(child => child.text || '').join(' ')
      }
      
      return JSON.stringify(content)
    } catch (e) {
      return 'Content rendering error'
    }
  }
  
  return content
}

function formatDate(dateString) {
  if (!dateString) return ''
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric', 
    month: 'long', 
    day: 'numeric'
  }).format(date)
}
</script>

<style>
.post-content {
  line-height: 1.7;
}

.post-content p {
  margin-bottom: 1.5rem;
}

.post-content h2 {
  font-size: 1.5rem;
  font-weight: 600;
  margin-top: 2rem;
  margin-bottom: 1rem;
}

.post-content h3 {
  font-size: 1.25rem;
  font-weight: 600;
  margin-top: 1.5rem;
  margin-bottom: 0.75rem;
}
</style>