# Developer Integration Instructions - Google Analytics 4

## 📋 What You'll Receive from Client

The client will send you an email with:
```
Measurement ID: G-XXXXXXXXXX
```

This will look something like: `G-ABC1234567` or `G-DEFGH89012`

---

## 🔧 How to Integrate (5 minutes)

### Step 1: Add Environment Variable

1. Create or update `.env.local`:

```env
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

Replace `G-XXXXXXXXXX` with the actual Measurement ID from the client.

### Step 2: Update Root Layout

Edit `src/app/layout.tsx`:

**Add the import at the top:**
```typescript
import GoogleAnalytics from "./components/GoogleAnalytics";
```

**Add inside the `<body>` tag (after opening `<body>`):**
```typescript
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <StructuredData />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${inter.variable} ${cormorantGaramond.variable} antialiased`}
      >
        {process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID && (
          <GoogleAnalytics
            measurementId={process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID}
          />
        )}
        {children}
      </body>
    </html>
  );
}
```

### Step 3: Deploy

1. **Add to Vercel Environment Variables:**
   - Go to Vercel Dashboard
   - Select your project
   - Go to Settings → Environment Variables
   - Add: `NEXT_PUBLIC_GA_MEASUREMENT_ID` = `G-XXXXXXXXXX`
   - Save and redeploy

2. **Local Testing:**
```bash
# Add to .env.local file
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX

# Restart dev server
npm run dev
```

---

## ✅ Testing the Integration

### Verify Installation

1. **Open the website** in browser
2. **Open DevTools** (F12)
3. **Go to Network tab**
4. **Look for requests to**: `google-analytics.com/g/collect`
5. If you see those requests → **GA4 is working!** ✅

### Check in Real-Time

1. Have client log into Google Analytics
2. Go to **Reports** → **Realtime**
3. Visit the website
4. Client should see **1 active user** in real-time report
5. If visible → **Integration successful!** 🎉

---

## 🎯 Advanced: Conversion Tracking (Optional Enhancement)

### Track "Enroll Today" Clicks

Add this to the enrollment button in `HomePage.tsx`:

```typescript
const handleEnrollClick = () => {
  // Track the event in GA4
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', 'enroll_click', {
      event_category: 'engagement',
      event_label: 'Enroll Today Button',
      value: 1
    });
  }

  // Navigate to enroll page
  window.location.href = '/enroll';
};
```

### Track Newsletter Signups

In the `handleNewsletterSubmit` function, add after successful subscription:

```typescript
// After successful newsletter subscription
if (response.ok) {
  // Track newsletter signup
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', 'newsletter_signup', {
      event_category: 'lead_generation',
      event_label: 'Footer Newsletter',
      value: 1
    });
  }

  setNewsletterStatus("success");
  // ... rest of code
}
```

### Track Shopify Purchases

Shopify automatically tracks purchases when you have GA4 integrated, but you can enhance it:

In `enroll/page.tsx`, after successful checkout creation:

```typescript
const handleEnrollment = async () => {
  // ... existing code ...

  const checkout = await createCheckout(variantId, 1);

  // Track checkout initiation
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', 'begin_checkout', {
      event_category: 'ecommerce',
      value: parseFloat(product.variants.edges[0].node.price.amount),
      currency: product.variants.edges[0].node.price.currencyCode,
      items: [{
        item_id: product.id,
        item_name: product.title,
        price: parseFloat(product.variants.edges[0].node.price.amount)
      }]
    });
  }

  window.location.href = checkout.webUrl;
};
```

---

## 📊 Custom Events Summary

Here are the recommended custom events to set up:

| Event Name | Trigger | Purpose |
|------------|---------|---------|
| `enroll_click` | User clicks "Enroll Today" | Track enrollment intent |
| `newsletter_signup` | Newsletter form submission | Track lead generation |
| `begin_checkout` | Redirect to Shopify checkout | Track purchase funnel |
| `video_play` | Course video plays (future) | Track engagement |

---

## 🔐 Privacy Compliance

### Cookie Consent (Optional but Recommended)

If client wants cookie consent banner, use:
- **CookieYes** (free plan available)
- **OneTrust** (enterprise)
- **Cookiebot** (popular in EU)

Or implement custom banner with:
```typescript
// Simple cookie consent check
const [cookieConsent, setCookieConsent] = useState<boolean | null>(null);

useEffect(() => {
  const consent = localStorage.getItem('cookie_consent');
  setCookieConsent(consent === 'true');
}, []);

// Only load GA4 if consent is given
{cookieConsent && process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID && (
  <GoogleAnalytics measurementId={process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID} />
)}
```

---

## 🐛 Troubleshooting

### GA4 Not Tracking

**Check:**
1. ✅ Measurement ID is correct (starts with `G-`)
2. ✅ Environment variable is set in Vercel
3. ✅ Page has been redeployed after adding env var
4. ✅ No ad blockers interfering (test in incognito)
5. ✅ Scripts are loading (check Network tab)

**Debug Mode:**
```typescript
// Add to gtag config for debugging
gtag('config', '${measurementId}', {
  debug_mode: true,
  page_path: window.location.pathname,
});
```

Then check browser console for GA4 debug messages.

### No Data in Reports

**Remember:**
- Data can take **24-48 hours** to appear in standard reports
- Real-time reports show data immediately
- Historical data doesn't backfill (tracking starts from integration date)

---

## 📧 Email Template to Client After Integration

```
Subject: ✅ Google Analytics 4 Integrated - Your Website is Now Tracking!

Hi [Client Name],

Great news! I've successfully integrated Google Analytics 4 into your website.

Your Measurement ID (G-XXXXXXXXXX) is now active and tracking visitor data.

What to expect:
• Real-time data: Available immediately in GA4
• Full reports: Will populate within 24-48 hours
• Tracking includes: Page views, traffic sources, user behavior, conversions

Next steps for you:
1. Log into Google Analytics at analytics.google.com
2. Go to Reports → Realtime
3. Visit your website (fstoptosuccess.com)
4. You should see yourself as an active user!

I've also set up tracking for:
✅ Newsletter signups
✅ "Enroll Today" button clicks
✅ Shopify checkout initiations

Let me know if you have any questions or need help interpreting your data!

Best regards,
[Your Name]
```

---

## 🎯 Quick Reference

### File Locations
- **GA Component**: `src/app/components/GoogleAnalytics.tsx` ✅ (already created)
- **Layout**: `src/app/layout.tsx` (needs update)
- **Env Variable**: `.env.local` and Vercel dashboard

### Environment Variable
```
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

### Testing URLs
- Real-time: https://analytics.google.com/analytics/web/#/realtime
- Debug: https://analytics.google.com/analytics/web/debugview

---

## ✅ Integration Checklist

- [ ] Receive Measurement ID from client
- [ ] Add to `.env.local` for local testing
- [ ] Import GoogleAnalytics in layout.tsx
- [ ] Add component to layout.tsx body
- [ ] Test locally (check Network tab)
- [ ] Add env variable to Vercel dashboard
- [ ] Deploy to production
- [ ] Verify in client's GA4 Real-time report
- [ ] Send confirmation email to client
- [ ] (Optional) Set up custom event tracking
- [ ] (Optional) Add cookie consent banner

---

**Estimated Integration Time**: 5-10 minutes
**Difficulty**: ⭐ Very Easy
**Files to Modify**: 1 (layout.tsx) + environment variables

The GoogleAnalytics component is already created and ready to use! Just add the Measurement ID when you receive it. 🚀
