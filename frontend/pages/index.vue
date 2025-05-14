<template>
  <div class="container mx-auto p-4">
    <h1 class="text-3xl font-bold mb-6">Latest Blog Posts</h1>
    
    <div class="mb-6">
      <label for="category" class="block text-sm font-medium mb-2">Filter by Category:</label>
      <select 
        id="category" 
        v-model="selectedCategory" 
        @change="filterByCategory"
        class="border rounded p-2 w-full md:w-64 bg-white dark:bg-gray-800 dark:border-gray-700"
      >
        <option value="">All Categories</option>
        <option v-for="category in categories" :key="category.id" :value="category.id">
          {{ category.name }}
        </option>
      </select>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="flex justify-center p-12">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 dark:border-white"></div>
    </div>

    <!-- Posts Grid -->
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

    <!-- No Posts State -->
    <div v-else class="text-center py-12">
      <p class="text-xl text-gray-600 dark:text-gray-300">No blog posts found.</p>
      <p v-if="selectedCategory" class="mt-2">
        Try selecting a different category or view all posts.
      </p>
    </div>
  </div>
</template>

<script setup>
const posts = ref([])
const categories = ref([])
const loading = ref(true)
const selectedCategory = ref('')

// Fetch categories and posts on page load
onMounted(async () => {
  try {
    await fetchCategories()
    await fetchPosts()
  } catch (error) {
    console.error('Error loading initial data:', error)
  } finally {
    loading.value = false
  }
})

// Fetch all categories
async function fetchCategories() {
  try {
    const response = await fetch('http://localhost:1337/api/categories?populate=*')
    const data = await response.json()
    categories.value = data.data.map(category => ({
      id: category.id,
      name: category.name,
      slug: category.slug
    }))
  } catch (error) {
    console.error('Error fetching categories:', error)
  }
}

// Fetch posts with optional category filter
async function fetchPosts() {
  loading.value = true
  try {
    let url = 'http://localhost:1337/api/blog-posts?populate[authors][populate]=*&populate[category]=*&populate=*'
    
    if (selectedCategory.value) {
      url += `&filters[category][id]=${selectedCategory.value}`
    }
    
    const response = await fetch(url)
    const data = await response.json()
    
    posts.value = data.data.map(post => ({
      id: post.id,
      title: post.attributes.title,
      slug: post.attributes.slug,
      content: post.attributes.content,
      publishedAt: post.attributes.publishedAt,
      authors: post.attributes.authors?.data?.map(author => ({
        id: author.id,
        name: author.attributes.name
      })) || [],
      category: post.attributes.category?.data ? {
        id: post.attributes.category.data.id,
        name: post.attributes.category.data.attributes.name,
        slug: post.attributes.category.data.attributes.slug
      } : null
    }))
  } catch (error) {
    console.error('Error fetching posts:', error)
    posts.value = []
  } finally {
    loading.value = false
  }
}

// Filter posts by category
function filterByCategory() {
  fetchPosts()
}

// Format author names for display
function authorNames(authors) {
  if (!authors || !authors.length) return 'Unknown'
  return authors.map(author => author.name).join(', ')
}

// Get a snippet of the content for preview
function getContentSnippet(content) {
  if (!content) return 'No content available'
  
  // For rich text content stored as blocks, try to extract text
  if (typeof content === 'object') {
    // This assumes a certain structure - adjust based on your actual data
    try {
      // Look for the first text block
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
      
      return text ? `${text.substring(0, 150)}${text.length > 150 ? '...' : ''}` : 'No content available'
    } catch (e) {
      return 'Content preview unavailable'
    }
  }
  
  // For plain text content
  return `${content.substring(0, 150)}${content.length > 150 ? '...' : ''}`
}

// Format date for display
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