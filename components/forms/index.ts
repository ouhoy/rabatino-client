import { defineAsyncComponent } from 'vue'

export default {
  'create-tourism-hotel-form': defineAsyncComponent(() => 
    import('./tourism/CreateHotelForm.vue')
  ),
  'create-tourism-restaurant-form': defineAsyncComponent(() => 
    import('./tourism/CreateRestaurantForm.vue')
  ),
  'create-tourism-attraction-form': defineAsyncComponent(() => 
    import('./tourism/CreateAttractionForm.vue')
  ),
  'create-education-university-form': defineAsyncComponent(() => 
    import('./education/CreateUniversityForm.vue')
  ),
  'create-education-college-form': defineAsyncComponent(() => 
    import('./education/CreateCollegeForm.vue')
  ),
  'create-education-library-form': defineAsyncComponent(() => 
    import('./education/CreateLibraryForm.vue')
  ),
  'create-education-coaching_center-form': defineAsyncComponent(() => 
    import('./education/CreateCoachingCenterForm.vue')
  ),
  'create-education-study_center-form': defineAsyncComponent(() => 
    import('./education/CreateStudyCenterForm.vue')
  ),
  'create-jobs-job-form': defineAsyncComponent(() => 
    import('./jobs/CreateJobForm.vue')
  ),
}
