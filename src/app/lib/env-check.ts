// Environment variable checker
export const checkEnvironmentVariables = () => {
  const envVars = {
    // Sanity variables
    NEXT_PUBLIC_SANITY_PROJECT_ID: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    NEXT_PUBLIC_SANITY_DATASET: process.env.NEXT_PUBLIC_SANITY_DATASET,
    SANITY_API_TOKEN: process.env.SANITY_API_TOKEN,
    
    // Node environment
    NODE_ENV: process.env.NODE_ENV,
    
    // Firebase variables (should work since they're NEXT_PUBLIC_)
    NEXT_PUBLIC_FIREBASE_API_KEY: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  };

  const results = {
    allEnvVars: envVars,
    missingVars: [] as string[],
    presentVars: [] as string[],
    sanitySummary: {
      projectId: !!envVars.NEXT_PUBLIC_SANITY_PROJECT_ID,
      dataset: !!envVars.NEXT_PUBLIC_SANITY_DATASET,
      token: !!envVars.SANITY_API_TOKEN,
      tokenLength: envVars.SANITY_API_TOKEN?.length || 0,
    }
  };

  // Check which variables are missing
  Object.entries(envVars).forEach(([key, value]) => {
    if (!value) {
      results.missingVars.push(key);
    } else {
      results.presentVars.push(key);
    }
  });

  return results;
};

// Runtime environment checker (client-side safe)
export const checkClientEnvironment = () => {
  if (typeof window !== 'undefined') {
    // We're on the client - only check NEXT_PUBLIC_ variables
    return {
      isClient: true,
      NEXT_PUBLIC_SANITY_PROJECT_ID: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
      NEXT_PUBLIC_SANITY_DATASET: process.env.NEXT_PUBLIC_SANITY_DATASET,
      NEXT_PUBLIC_FIREBASE_API_KEY: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
      // SANITY_API_TOKEN won't be available on client (that's correct)
    };
  } else {
    // We're on the server - check all variables
    return {
      isClient: false,
      ...checkEnvironmentVariables(),
    };
  }
};