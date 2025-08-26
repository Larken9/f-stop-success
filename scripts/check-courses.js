/**
 * Check Courses Script
 * 
 * This script checks what courses exist in Sanity and shows their details
 */

const { createClient } = require('@sanity/client');
require('dotenv').config({ path: '.env.local' });

// Initialize Sanity client
const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
  apiVersion: '2024-01-01'
});

async function checkCourses() {
  console.log('🔍 CHECKING COURSES IN SANITY');
  console.log('=============================');
  
  try {
    // Fetch all courses with their module and lesson counts
    const coursesQuery = `*[_type == "course"] | order(_createdAt desc) {
      _id,
      _createdAt,
      title,
      slug,
      description,
      "moduleCount": count(*[_type == "module" && references(^._id)]),
      "lessonCount": count(*[_type == "lesson" && references(^._id)])
    }`;
    
    const courses = await client.fetch(coursesQuery);
    
    if (courses.length === 0) {
      console.log('❌ No courses found in Sanity');
      return;
    }
    
    console.log(`📚 Found ${courses.length} course(s):\n`);
    
    courses.forEach((course, index) => {
      console.log(`${index + 1}. ${course.title}`);
      console.log(`   📖 ID: ${course._id}`);
      console.log(`   🔗 Slug: ${course.slug?.current || 'No slug'}`);
      console.log(`   📝 Description: ${course.description || 'No description'}`);
      console.log(`   📂 Modules: ${course.moduleCount}`);
      console.log(`   📄 Lessons: ${course.lessonCount}`);
      console.log(`   📅 Created: ${new Date(course._createdAt).toLocaleString()}`);
      console.log('');
    });
    
    // If there are multiple courses, recommend which one to keep
    if (courses.length > 1) {
      console.log('⚠️  MULTIPLE COURSES DETECTED');
      console.log('----------------------------');
      
      const completeCourse = courses.find(c => c.lessonCount > 30);
      const incompleteCourse = courses.find(c => c.lessonCount < 10);
      
      if (completeCourse && incompleteCourse) {
        console.log('🎯 RECOMMENDATION:');
        console.log(`✅ Keep: "${completeCourse.title}" (${completeCourse.lessonCount} lessons) - Complete course`);
        console.log(`❌ Delete: "${incompleteCourse.title}" (${incompleteCourse.lessonCount} lessons) - Incomplete course`);
        console.log('');
        console.log('To delete the incomplete course:');
        console.log('1. Go to your Sanity Studio');
        console.log('2. Navigate to Courses');
        console.log(`3. Delete the course with ID: ${incompleteCourse._id}`);
        console.log('4. Also delete any associated modules and lessons');
      }
    }
    
    console.log('🔗 Next steps:');
    console.log('- Check your Sanity Studio to verify the data');
    console.log('- If you have duplicates, delete the incomplete version');
    console.log('- The dashboard should automatically show the correct course');
    
  } catch (error) {
    console.error('❌ Error fetching courses:', error.message);
  }
}

if (require.main === module) {
  checkCourses();
}

module.exports = { checkCourses };