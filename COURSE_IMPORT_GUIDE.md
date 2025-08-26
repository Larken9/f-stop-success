# 📚 Course Content Import Guide

This guide will help you automatically import your course content from your Documents folder into Sanity CMS.

## 🎯 Quick Start

### 1. **Prepare Your Content**
Make sure your course content is organized in your Documents folder like this:
```
📁 Documents/
  📁 F-STOP to Success Course/     ← Main course folder
    📁 Module 1 - Introduction/    ← Module folders
      📄 Lesson 1 - Welcome.txt   ← Lesson files (.txt or .md)
      📄 Lesson 2 - Overview.txt
    📁 Module 2 - Photography Basics/
      📄 Lesson 1 - Camera Settings.txt
      📄 Lesson 2 - Composition.txt
```

### 2. **Get Your Sanity API Token**
1. Go to [sanity.io/manage](https://sanity.io/manage)
2. Select your project
3. Go to **Settings** → **API** → **Tokens**
4. Create a new token with **Editor** permissions
5. Copy the token

### 3. **Add Token to Environment**
Add this line to your `.env.local` file:
```
SANITY_API_TOKEN=your_token_here
```

### 4. **Scan Your Content (Preview)**
First, preview what will be imported:
```bash
npm run import:scan
```

### 5. **Import Your Content**
If the preview looks good, run the import:
```bash
npm run import:course
```

## 🔧 Configuration

### Custom Folder Location
Edit `scripts/import-config.js` to change the course folder name:
```javascript
COURSE_FOLDER_NAME: 'Your Course Folder Name'
```

Or set a custom path:
```javascript
COURSE_PATH: 'C:\\Path\\To\\Your\\Course\\Folder'
```

### Supported File Formats
- `.txt` - Plain text files ✅
- `.md` - Markdown files ✅  
- `.docx` - Word documents (basic support)

## 📝 Content Structure

The import script recognizes these section headers in your lesson files:

### **Introduction Section**
- "Introduction"
- "Welcome" 
- "Intro"

### **What You'll Cover Section**
- "What You'll Cover"
- "Why It's Important"
- "Overview"

### **Main Teaching Points**
- "Main Teaching Points"
- "Main Points"
- "Content"
- "Teaching Points"

### **Review and Outcome**
- "Review"
- "Outcome" 
- "Summary"
- "Recap"

### **Next Steps**
- "Next Steps"
- "What's Next"  
- "Moving Forward"

### **Action Task**
- "Action Task"
- "Homework"
- "Assignment"
- "Practice"

## 📋 Example Lesson Format

```
Welcome to Lesson 1

Introduction
Welcome to the first lesson of our photography course. In this lesson, we'll cover the fundamentals.

What You'll Cover
- Camera basics
- Composition rules
- Lighting principles

Why It's Important
Understanding these basics will set the foundation for all your future photography work.

Main Teaching Points
1. Camera Settings
   - Aperture controls depth of field
   - Shutter speed controls motion blur
   - ISO controls sensitivity to light

2. Composition Rules
   - Rule of thirds
   - Leading lines
   - Framing

Review and Outcome
By the end of this lesson, you'll understand the basic camera controls and composition principles.

Next Steps
In the next lesson, we'll practice these concepts with hands-on exercises.

Action Task
Take 10 photos using different aperture settings and note the differences in depth of field.
```

## 🔍 Troubleshooting

### "Course directory not found"
- Check that your course folder exists in Documents
- Verify the folder name matches `COURSE_FOLDER_NAME` in config
- Try using an absolute path in the config

### "Missing SANITY_API_TOKEN"
- Make sure you added the token to `.env.local`
- Restart your development server after adding the token
- Check that the token has Editor permissions

### "Unsupported file format"
- Convert .docx files to .txt or .md
- Make sure lesson files have proper extensions
- Check the supported extensions in the config

### "No lessons found"
- Ensure lesson files are inside module folders
- Check that files have supported extensions
- Run `npm run import:scan` to see what was detected

### Import creates duplicate content
- Set `skipExisting: true` in import-config.js
- Or manually delete existing content in Sanity Studio first

## 🎛️ Advanced Options

### Dry Run (Preview Only)
Set `DEBUG.dryRun: true` in import-config.js to preview without creating content.

### Verbose Logging
Set `DEBUG.verbose: true` for detailed parsing information.

### Custom Section Headers
Add your own section patterns in `SECTION_HEADERS` in import-config.js.

### Batch Size
Adjust `IMPORT_OPTIONS.batchSize` if you hit rate limits.

## 📊 What Gets Created

The import script creates:

### 🎓 **Course Document**
- Title: "F-STOP to Success"
- Instructor reference
- Price, difficulty, category
- Publication date

### 📚 **Module Documents** 
- Title from folder name
- Module number (extracted from folder name)
- Course reference
- Description and duration

### 📖 **Lesson Documents**
- Title from filename
- Lesson number (extracted from filename)  
- Module and course references
- Structured content sections
- Action tasks and resources

## 🔗 After Import

1. **Check Sanity Studio** - Visit your studio to see imported content
2. **Review Content** - Check that sections parsed correctly
3. **Add Media** - Upload featured images and videos
4. **Publish Content** - Content is auto-published but you can unpublish if needed
5. **Test Course Flow** - Make sure lessons link properly

## 💡 Tips

- **File Naming**: Use consistent naming like "Lesson 1 - Title.txt"
- **Folder Naming**: Use "Module 1 - Title" format  
- **Content Structure**: Use clear section headers in your files
- **Incremental Import**: You can run the import multiple times safely
- **Backup**: Always backup your Sanity data before large imports

## 🆘 Need Help?

1. Run `npm run import:scan` to debug what's being detected
2. Check the console output for detailed error messages
3. Verify your file structure matches the expected format
4. Test with a single lesson first before importing everything

---

Happy importing! 🚀