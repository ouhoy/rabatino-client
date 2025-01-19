<script setup lang="ts">

import PageHeader from "../../components/pageHeader.vue";
import Card from "../../components/card.vue";
const fakePosts = [
  {
    title: "The Ultimate Guide to Rabat",
    imgUrl: "https://images.unsplash.com/photo-1737229940875-293ed0c4e8af?q=80&w=2071&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
  },
  {
    title: "The Ultimate Guide to Rabat",
    imgUrl: "https://images.unsplash.com/photo-1489749798305-4fea3ae63d43?q=80&w=2067&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
  },
  {
    title: "The Ultimate Guide to Rabat",
    imgUrl: "https://images.unsplash.com/photo-1529245276044-5d989655f07e?q=80&w=1925&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
  },
  {
    title: "The Ultimate Guide to Rabat",
    imgUrl: "https://images.unsplash.com/photo-1519594445471-0e5f86b3fb09?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
  },

  {
    title: "Exploring Rabat's Medina",
    imgUrl: "https://images.unsplash.com/photo-1518895771514-9cb0f6ed3a1a?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
  },
  {
    title: "Top 10 Restaurants in Rabat",
    imgUrl: "https://images.unsplash.com/photo-1612838320302-3b3b3b3b3b3b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwyMjIwNzV8MHwxfGFsbHwxf"
  },
  {
    title: "Rabat's Historical Sites",
    imgUrl: "https://images.unsplash.com/photo-1612838320302-3b3b3b3b3b3b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwyMjIwNzV8MHwxfGFsbHwxf"
  },
  {
    title: "A Day in Rabat",
    imgUrl: "https://images.unsplash.com/photo-1612838320302-3b3b3b3b3b3b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwyMjIwNzV8MHwxfGFsbHwxf"
  },
  {
    title: "Rabat's Nightlife",
    imgUrl: "https://images.unsplash.com/photo-1612838320302-3b3b3b3b3b3b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwyMjIwNzV8MHwxfGFsbHwxf"
  },
  {
    title: "Shopping in Rabat",
    imgUrl: "https://images.unsplash.com/photo-1612838320302-3b3b3b3b3b3b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwyMjIwNzV8MHwxfGFsbHwxf"
  },
  {
    title: "Rabat's Best Parks",
    imgUrl: "https://images.unsplash.com/photo-1612838320302-3b3b3b3b3b3b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwyMjIwNzV8MHwxfGFsbHwxf"
  }
];


const categories = [
  {id: 0, name: 'All'},
  {id: 1, name: 'Hotels'},
  {id: 2, name: 'Restaurants'},
  {id: 3, name: 'Theaters'},
  {id: 4, name: 'ATMs'},
  {id: 5, name: 'Tourist Attractions'},
];

const selectedCategory = ref<number | null>(0);

const filterListings = (categoryId: number) => {
  console.log(categoryId);
}
const handleCategoryClick = (categoryId: number) => {


  if (selectedCategory.value === categoryId) {
    return;
  }
  selectedCategory.value = categoryId;
  filterListings(categoryId);


}


</script>

<template>
  <main class="w-full">
    <div class="py-12 flex flex-col items-center justify-center gap-6">

      <page-header title="Tourism"
                   description="All tourism-related operations in the city, including hotels, restaurants,
                  tourist attractions, ATMs, theatres, and so on."></page-header>


      <section
          class="w-full  overflow-x-auto flex gap-2 items-center justify-center">
        <button @click="handleCategoryClick(category.id)"
                v-for="category in categories"
                :key="category.id"
                :class="{ 'bg-neutral-950 border-neutral-950 !bg-opacity-100 text-white': selectedCategory === category.id }"
                class="select-none py-2 px-4 text-sm font-medium bg-neutral-50 bg-opacity-20 text-neutral-950 rounded-full border border-neutral-300">
          {{ category.name }}
        </button>
      </section>

    </div>

    <div class="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4  3xl:grid-cols-5 gap-8 md:gap-4">
      <card v-for="post in fakePosts" :title="post.title" :imgUrl="post.imgUrl"/>
    </div>
  </main>
</template>

<style scoped>

</style>