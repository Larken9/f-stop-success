import { createClient } from "@sanity/client";

export interface SanityDebugResult {
  success: boolean;
  error?: string;
  details: {
    projectId: string | undefined;
    dataset: string | undefined;
    hasToken: boolean;
    tokenLength: number;
    tokenPrefix: string;
    clientConfigured: boolean;
  };
  tests: {
    basicRead: { success: boolean; error?: string; data?: any };
    basicWrite: { success: boolean; error?: string; data?: any };
    tokenPermissions: { success: boolean; error?: string; data?: any };
  };
}

export const debugSanityConnection = async (): Promise<SanityDebugResult> => {
  const result: SanityDebugResult = {
    success: false,
    details: {
      projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
      dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
      hasToken: !!process.env.SANITY_API_TOKEN,
      tokenLength: process.env.SANITY_API_TOKEN?.length || 0,
      tokenPrefix: process.env.SANITY_API_TOKEN?.substring(0, 8) || '',
      clientConfigured: false
    },
    tests: {
      basicRead: { success: false },
      basicWrite: { success: false },
      tokenPermissions: { success: false }
    }
  };

  try {
    // Test client configuration
    const readClient = createClient({
      projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
      dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
      useCdn: false,
      apiVersion: "2023-05-03",
    });

    const writeClient = createClient({
      projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
      dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
      useCdn: false,
      apiVersion: "2023-05-03",
      token: process.env.SANITY_API_TOKEN!,
      ignoreBrowserTokenWarning: true,
    });

    result.details.clientConfigured = true;

    // Test 1: Basic read (should work without token)
    try {
      const readData = await readClient.fetch('*[_type == "course"][0..2]{_id, title}');
      result.tests.basicRead.success = true;
      result.tests.basicRead.data = readData;
    } catch (error) {
      result.tests.basicRead.error = error instanceof Error ? error.message : String(error);
    }

    // Test 2: Token permissions check
    try {
      const tokenData = await writeClient.fetch('*[_type == "sanity.imageAsset"][0..1]{_id}');
      result.tests.tokenPermissions.success = true;
      result.tests.tokenPermissions.data = tokenData;
    } catch (error) {
      result.tests.tokenPermissions.error = error instanceof Error ? error.message : String(error);
    }

    // Test 3: Basic write operation (create a test document)
    try {
      const testDoc = {
        _type: "testDocument",
        title: "Sanity Connection Test",
        createdAt: new Date().toISOString(),
        testId: Math.random().toString(36).substring(7)
      };

      const writeData = await writeClient.create(testDoc);
      result.tests.basicWrite.success = true;
      result.tests.basicWrite.data = writeData;

      // Clean up test document
      try {
        await writeClient.delete(writeData._id);
      } catch (cleanupError) {
        console.warn('Could not clean up test document:', cleanupError);
      }
    } catch (error) {
      result.tests.basicWrite.error = error instanceof Error ? error.message : String(error);
    }

    // Overall success determination
    result.success = result.tests.basicRead.success && 
                    result.tests.tokenPermissions.success && 
                    result.tests.basicWrite.success;

  } catch (error) {
    result.error = error instanceof Error ? error.message : String(error);
  }

  return result;
};

export const testUserEnrollmentCreate = async (testUserId: string = 'test-user-debug'): Promise<{
  success: boolean;
  error?: string;
  data?: any;
}> => {
  try {
    const writeClient = createClient({
      projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
      dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
      useCdn: false,
      apiVersion: "2023-05-03",
      token: process.env.SANITY_API_TOKEN!,
      ignoreBrowserTokenWarning: true,
    });

    const testEnrollment = {
      _type: "userEnrollment",
      userId: testUserId,
      email: "test@example.com",
      displayName: "Test User",
      roles: ["enrolled"],
      enrolledCourses: [],
      enrollmentDate: new Date().toISOString(),
      lastActivity: new Date().toISOString(),
      status: 'active'
    };

    const result = await writeClient.create(testEnrollment);
    
    // Clean up immediately
    try {
      await writeClient.delete(result._id);
    } catch (cleanupError) {
      console.warn('Could not clean up test enrollment:', cleanupError);
    }

    return { success: true, data: result };
  } catch (error) {
    return { 
      success: false, 
      error: error instanceof Error ? error.message : String(error) 
    };
  }
};

export const checkSanitySchemas = async (): Promise<{
  success: boolean;
  error?: string;
  schemas?: string[];
}> => {
  try {
    const client = createClient({
      projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
      dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
      useCdn: false,
      apiVersion: "2023-05-03",
      token: process.env.SANITY_API_TOKEN!,
    });

    // Get distinct document types
    const schemas = await client.fetch('array::unique(*[]._type)');
    
    return { success: true, schemas };
  } catch (error) {
    return { 
      success: false, 
      error: error instanceof Error ? error.message : String(error) 
    };
  }
};