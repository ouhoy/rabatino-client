<script setup lang="ts">
import JobCard from '~/components/JobCard.vue'
import Card from '~/components/Card.vue'

 enum PostType {
  JOB = 1,
  EDUCATION = 2,
  BUSINESS = 3,
  TOURISM = 4,
}


interface SearchPost {
  id: number
  title: string
  typeId: PostType
  featuredImage?: string
  featuredImg?: string // for business posts
  // Job specific fields
  company?: string
  logo?: string
  // Education specific fields
  institutionType?: string
  // Tourism specific fields
  tourismType?: string
}

interface PaginatedSearchResponse {
  meta: {
    total: number
    per_page: number
    current_page: number
    last_page: number
    first_page: number
    firstPageUrl: string
    lastPageUrl: string
    nextPageUrl: string | null
    previousPageUrl: string | null
  }
  data: SearchPost[]
}

const categories = [
  { id: 0, name: 'All Posts' },
  { id: 1, name: 'Jobs', type: PostType.JOB },
  { id: 2, name: 'Education', type: PostType.EDUCATION },
  { id: 3, name: 'Business', type: PostType.BUSINESS },
  { id: 4, name: 'Tourism', type: PostType.TOURISM }
]

const config = useRuntimeConfig()
const route = useRoute()
const isLoading = ref(true)
const posts = ref<SearchPost[]>([])
const filteredPosts = ref<SearchPost[]>([])
const selectedCategory = ref(0)
const noResults = ref(false)
const pagination = ref<PaginatedSearchResponse['meta'] | null>(null)
const currentPage = ref(1)

// Add category-specific no results messages
const categoryMessages = {
  [PostType.JOB]: "No job posts found in this category.",
  [PostType.EDUCATION]: "No educational institutions found in this category.",
  [PostType.BUSINESS]: "No business posts found in this category.",
  [PostType.TOURISM]: "No tourism posts found in this category.",
  default: "No results found in this category."
};

// Fetch search results
async function fetchSearchResults(page = 1) {
  try {
    isLoading.value = true;
    noResults.value = false;
    
    const response = await fetch(
      `${config.public.apiBaseUrl}/posts/search?query=${route.params.slug}&page=${page}`
    );
    
    if (!response.ok) throw new Error('Search failed');
    
    const data: PaginatedSearchResponse = await response.json();
    posts.value = data.data;
    filteredPosts.value = data.data;
    pagination.value = data.meta;
    currentPage.value = data.meta.current_page;
    
    if (data.data.length === 0) {
      noResults.value = true;
    }
  } catch (error) {
    console.error('Search error:', error);
  } finally {
    isLoading.value = false;
  }
}

// Filter posts by type
function handleCategoryClick(categoryId: number) {
  selectedCategory.value = categoryId;
  
  if (categoryId === 0) {
    filteredPosts.value = posts.value;
  } else {
    const category = categories[categoryId];
    filteredPosts.value = posts.value.filter(
      post => post.typeId === category.type
    );
  }

  // Set no results state based on filtered posts
  noResults.value = filteredPosts.value.length === 0;
}

// Get appropriate message based on selected category
const noResultsMessage = computed(() => {
  if (selectedCategory.value === 0) {
    return "No results found for your search";
  }
  const category = categories[selectedCategory.value];
  return categoryMessages[category.type] || categoryMessages.default;
});

// Generate correct view URL based on post type
function getViewUrl(post: SearchPost): string {
  switch (post.typeId) {
    case PostType.JOB:
      return `/career/${post.id}`;
    case PostType.EDUCATION:
      if (post.institutionType) {
        const type = post.institutionType.toLowerCase().replace('_', '-');
        return `/education/${type}/${post.id}`;
      }
      return `/education/${post.id}`;
    case PostType.BUSINESS:
      return `/business/${post.id}`;
    case PostType.TOURISM:
      if (post.tourismType) {
        const type = post.tourismType.toLowerCase();
        return `/tourism/${type}/${post.id}`;
      }
      return `/tourism/${post.id}`;
    default:
      return '/';
  }
}

// Add pagination handler
async function handlePageChange(page: number) {
  if (page < 1 || (pagination.value && page > pagination.value.last_page)) return;
  await fetchSearchResults(page);
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

onMounted(() => {
  fetchSearchResults();
});
</script>

<template>
  <main class="w-full">
    <div class="py-12 flex flex-col items-center justify-center gap-6">
      <PageHeader
        :title="`Search Results for: ${route.params.slug}`"
        description="Browse through matching results from all categories"
      />

      <section class="w-full overflow-x-auto flex gap-2 items-center justify-center">
        <button
          v-for="category in categories"
          :key="category.id"
          @click="handleCategoryClick(category.id)"
          :class="{ 'bg-neutral-950 border-neutral-950 !bg-opacity-100 text-white': selectedCategory === category.id }"
          class="select-none py-2 px-4 text-sm font-medium bg-neutral-50 bg-opacity-20 text-neutral-950 rounded-full border border-neutral-300"
        >
          {{ category.name }}
        </button>
      </section>
    </div>

    <!-- Loading State -->
    <div v-if="isLoading" class="flex justify-center items-center py-12">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
    </div>

    <!-- No Results State -->
    <div v-else-if="noResults" class="text-center py-12">
      <h3 class="text-xl font-semibold text-gray-900 mb-2">{{ noResultsMessage }}</h3>
      <p class="text-gray-600">Try a different category or modify your search terms</p>
    </div>

    <!-- Results Grid -->
    <div v-else class="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 md:gap-4">
      <nuxt-link
        v-for="post in filteredPosts"
        :key="post.id"
        :to="getViewUrl(post)"
      >
        <JobCard
          v-if="post.typeId === PostType.JOB"
          :title="post.title"
          :company="post.company"
          :logo="post.logo"
        />
        <Card
          v-else
          :title="post.title"
          :imgUrl="post.featuredImage || post.featuredImg"
        />
      </nuxt-link>
    </div>

    <!-- Pagination -->
    <div v-if="pagination && !noResults" class="mt-8 flex justify-center">
      <!-- Mobile Pagination -->
      <div class="flex flex-1 justify-between sm:hidden">
        <button
          :disabled="currentPage === 1"
          @click="handlePageChange(currentPage - 1)"
          :class="[
            'relative inline-flex items-center px-4 py-2 text-sm font-medium rounded-md',
            currentPage === 1 
              ? 'opacity-50 cursor-not-allowed'
              : 'text-neutral-900 hover:bg-neutral-50'
          ]"
        >
          Previous
        </button>
        <button
          :disabled="currentPage === pagination.last_page"
          @click="handlePageChange(currentPage + 1)"
          :class="[
            'relative ml-3 inline-flex items-center px-4 py-2 text-sm font-medium rounded-md',
            currentPage === pagination.last_page
              ? 'opacity-50 cursor-not-allowed'
              : 'text-neutral-900 hover:bg-neutral-50'
          ]"
        >
          Next
        </button>
      </div>

      <!-- Desktop Pagination -->
      <div class="hidden sm:flex">
        <nav class="inline-flex gap-2" aria-label="Pagination">
          <button
            v-for="page in pagination.last_page"
            :key="page"
            @click="handlePageChange(page)"
            :class="[
              'relative inline-flex items-center px-4 py-2 text-sm font-medium focus:z-20 rounded-full transition-colors',
              page === currentPage 
                ? 'bg-neutral-950 text-white'
                : 'text-neutral-900 hover:bg-neutral-100'
            ]"
          >
            {{ page }}
          </button>
        </nav>
      </div>
    </div>
  </main>
</template>

<style scoped>

</style>