/**
 * Cleanup Duplicate Course Script
 * 
 * This script helps you delete the incomplete duplicate course
 * WARNING: This will permanently delete the incomplete course and its content
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

const INCOMPLETE_COURSE_ID = '3eb72bba-64c2-49ff-a14a-3f9a2d39d019';

async function cleanupDuplicateCourse() {
  console.log('🧹 CLEANUP DUPLICATE COURSE');
  console.log('============================');
  console.log('⚠️  WARNING: This will permanently delete the incomplete course!');
  console.log('');
  
  try {
    // First, verify what we're about to delete
    const courseToDelete = await client.fetch(`*[_id == "${INCOMPLETE_COURSE_ID}"][0]{
      _id,
      title,
      "moduleCount": count(*[_type == "module" && references(^._id)]),
      "lessonCount": count(*[_type == "lesson" && references(^._id)])
    }`);
    
    if (!courseToDelete) {
      console.log('✅ Course already deleted or not found');
      return;
    }
    
    console.log('📚 Course to be deleted:');
    console.log(`   Title: ${courseToDelete.title}`);
    console.log(`   Modules: ${courseToDelete.moduleCount}`);
    console.log(`   Lessons: ${courseToDelete.lessonCount}`);
    console.log('');
    
    if (courseToDelete.lessonCount > 30) {
      console.log('❌ SAFETY CHECK FAILED');
      console.log('This course has too many lessons to be the incomplete version.');
      console.log('Aborting deletion to prevent accidental data loss.');
      return;
    }
    
    console.log('🗑️  Deleting associated content...');
    
    // Delete lessons first
    const lessonsToDelete = await client.fetch(`*[_type == "lesson" && references("${INCOMPLETE_COURSE_ID}")]{_id}`);
    console.log(`   Deleting ${lessonsToDelete.length} lessons...`);
    
    for (const lesson of lessonsToDelete) {
      await client.delete(lesson._id);
    }
    
    // Delete modules
    const modulesToDelete = await client.fetch(`*[_type == "module" && references("${INCOMPLETE_COURSE_ID}")]{_id}`);
    console.log(`   Deleting ${modulesToDelete.length} modules...`);
    
    for (const module of modulesToDelete) {
      await client.delete(module._id);
    }
    
    // Finally delete the course
    console.log('   Deleting course...');
    await client.delete(INCOMPLETE_COURSE_ID);
    
    console.log('');
    console.log('✅ CLEANUP COMPLETE!');
    console.log('The incomplete duplicate course has been removed.');
    console.log('Your dashboard should now show the complete course with 38 lessons.');
    console.log('');
    console.log('🔄 Next steps:');
    console.log('1. Refresh your dashboard page');
    console.log('2. Verify the complete course is now showing');
    console.log('3. Test the lesson navigation');
    
  } catch (error) {
    console.error('❌ Error during cleanup:', error.message);
    console.log('');
    console.log('💡 Alternative: Manual cleanup via Sanity Studio');
    console.log('1. Go to your Sanity Studio');
    console.log('2. Navigate to Courses');
    console.log(`3. Delete the incomplete course manually`);
  }
}

// Add safety prompt
const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function askConfirmation() {
  return new Promise((resolve) => {
    rl.question('⚠️  Are you sure you want to delete the incomplete course? (yes/no): ', (answer) => {
      rl.close();
      resolve(answer.toLowerCase() === 'yes' || answer.toLowerCase() === 'y');
    });
  });
}

async function main() {
  const confirmed = await askConfirmation();
  
  if (confirmed) {
    await cleanupDuplicateCourse();
  } else {
    console.log('❌ Cleanup cancelled');
    console.log('');
    console.log('💡 The dashboard query has been fixed to show the complete course.');
    console.log('You can manually delete the duplicate course in Sanity Studio if needed.');
  }
}

if (require.main === module) {
  main();
}