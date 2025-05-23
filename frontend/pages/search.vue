<!-- u23629810, Philemon -->
<template>
  <div class="container mx-auto p-4">
    <h1 class="text-3xl font-bold mb-6">Search</h1>
    
    <div class="mb-8">
      <div class="flex flex-col md:flex-row gap-4">
        <div class="flex-grow">
          <input 
            v-model="searchQuery" 
            type="text" 
            placeholder="Search for posts or authors..." 
            class="w-full p-3 border rounded-lg bg-white dark:bg-gray-800 dark:border-gray-700"
            @keyup.enter="performSearch"
          />
        </div>
        <div>
          <select 
            v-model="searchType" 
            class="w-full md:w-40 p-3 border rounded-lg bg-white dark:bg-gray-800 dark:border-gray-700"
          >
            <option value="all">All</option>
            <option value="posts">Posts</option>
            <option value="authors">Authors</option>
          </select>
        </div>
        <div>
          <button 
            @click="performSearch" 
            class="w-full md:w-auto px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Search
          </button>
        </div>
      </div>
    </div>
    
    <!-- Loading State -->
    <div v-if="loading" class="flex justify-center p-12">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 dark:border-white"></div>
    </div>
    
    <div v-else>
      <div v-if="searchResults.posts.length > 0" class="mb-8">
        <h2 class="text-2xl font-semibold mb-4">Posts</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div 
            v-for="post in searchResults.posts" 
            :key="post.id" 
            class="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow dark:border-gray-700"
          >
            <NuxtLink :to="`/posts/${post.slug}`" class="block h-full">
              <div class="p-4 h-full flex flex-col">
                <h3 class="text-xl font-semibold mb-2">{{ post.title }}</h3>
                <div class="text-sm text-gray-600 dark:text-gray-300 mb-3">
                  <span v-if="post.authors && post.authors.length">
                    By {{ authorNames(post.authors) }}
                  </span>
                </div>
                <p class="text-gray-700 dark:text-gray-300 flex-grow">
                  {{ getContentSnippet(post.content) }}
                </p>
              </div>
            </NuxtLink>
          </div>
        </div>
      </div>
      
      <div v-if="searchResults.authors.length > 0" class="mb-8">
        <h2 class="text-2xl font-semibold mb-4">Authors</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div 
            v-for="author in searchResults.authors" 
            :key="author.id" 
            class="border rounded-lg overflow-hidden p-4 shadow-sm hover:shadow-md transition-shadow dark:border-gray-700"
          >
            <h3 class="text-xl font-semibold mb-2">{{ author.name }}</h3>
            <p class="text-gray-700 dark:text-gray-300">
              {{ author.bio || 'No bio available' }}
            </p>
            <div class="mt-4">
              <h4 class="font-medium mb-2">Recent posts:</h4>
              <ul class="list-disc list-inside">
                <li v-for="post in author.posts.slice(0, 3)" :key="post.id" class="mb-1">
                  <NuxtLink :to="`/posts/${post.slug}`" class="hover:underline text-blue-600 dark:text-blue-400">
                    {{ post.title }}
                  </NuxtLink>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      
      <div v-if="!searchResults.posts.length && !searchResults.authors.length && searchPerformed" class="text-center py-12">
        <p class="text-xl text-gray-600 dark:text-gray-300">
          No results found for "{{ searchQuery }}".
        </p>
        <p class="mt-2">Try a different search term or search type.</p>
      </div>
    </div>
  </div>
</template>

<script setup>
const config = useRuntimeConfig()
const strapiUrl = config.public.strapiUrl
const searchQuery = ref('')
const searchType = ref('all')
const loading = ref(false)
const searchPerformed = ref(false)
const searchResults = ref({
  posts: [],
  authors: []
})

async function performSearch() {
  if (!searchQuery.value.trim()) return
  
  loading.value = true
  searchPerformed.value = true
  searchResults.value = {
    posts: [],
    authors: []
  }
  
  try {
    if (searchType.value === 'all' || searchType.value === 'posts') {
      await searchPosts()
    }
    
    if (searchType.value === 'all' || searchType.value === 'authors') {
      await searchAuthors()
    }
  } catch (error) {
    console.error('Search error:', error)
  } finally {
    loading.value = false
  }
}

async function searchPosts() {
  try {
    const searchTerm = searchQuery.value.trim();
    const url = `${strapiUrl}/api/blog-posts?populate=category&populate=authors&filters[$or][0][title][$contains]=${searchTerm}&filters[$or][1][authors][name][$contains]=${searchTerm}`;

    const response = await fetch(url);
    const data = await response.json();

    searchResults.value.posts = data.data.map(post => ({
      id: post.id,
      title: post.title,
      slug: post.slug,
      content: post.content,
      publishedAt: post.publishedAt,
      category: post.category?.data?.attributes?.name || null,
      authors: post.authors?.data?.map(author => ({
        id: author.id,
        name: author.name,
      })) || [],
    }));
  } catch (error) {
    console.error('Error searching posts:', error);
  }
}

async function searchAuthors() {
  try {
    const authorname = searchQuery.value.trim()
    const url = `${strapiUrl}/api/authors?&filters[name][$contains]=${authorname}`
    
    const response = await fetch(url)
    const data = await response.json()
    console.log('Authors data:', data)
    
    searchResults.value.authors = data.data.map(author => ({
      id: author.id,
      name: author.name,
      bio: author.bio,
      posts: author.blog_posts?.data?.map(post => ({
        id: post.id,
        title: post.title,
        slug: post.slug
      })) || []
    }))
  } catch (error) {
    console.error('Error searching authors:', error)
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
</script>