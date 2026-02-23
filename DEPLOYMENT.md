# Vercel Deployment Guide

This guide walks through deploying the Banking API to Vercel in just a few steps.

## Prerequisites

- GitHub account with your repository pushed
- Vercel account (free tier supported)
- Node.js 20+ compatible project

## Step-by-Step Deployment

### 1. Push Code to GitHub

```bash
git add .
git commit -m "Initial banking API project"
git push origin main
```

### 2. Import Project to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Click **"New Project"**
3. Select **"Import Git Repository"**
4. Choose your GitHub repository containing the banking API
5. Click **"Import"**

### 3. Configure Environment Variables

Vercel auto-detects Node.js projects. During setup:

1. Vercel dashboard shows **"Environment Variables"** section
2. Add the following variables:

   | Variable | Value | Notes |
   | --- | --- | --- |
   | `JWT_SECRET` | Generate a 32+ character secret | Use a strong random string. Example: `openssl rand -hex 32` |
   | `CORS_ORIGIN` | `http://localhost:3000,http://10.0.2.2:3000` | Add your production domain later |
   | `NODE_ENV` | `production` | Auto-set to production |

3. Click **"Deploy"**

### 4. Monitor Deployment

- Vercel builds and deploys automatically
- Check status in Vercel dashboard
- Build takes ~2-3 minutes
- You'll get a URL like: `https://<project-name>.vercel.app`

### 5. Update Android App Base URL

Once deployed, update your Android client:

```kotlin
object ApiConfig {
    const val BASE_URL = "https://your-project-name.vercel.app"
}

val retrofitClient = Retrofit.Builder()
    .baseUrl(ApiConfig.BASE_URL)
    .addConverterFactory(GsonConverterFactory.create())
    .build()
```

### 6. Test the Deployment

```bash
# Test health endpoint
curl https://your-project-name.vercel.app/health

# Test login endpoint
curl -X POST https://your-project-name.vercel.app/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "alex@example.com", "password": "password"}'
```

## Production Checklist

Before considering the API production-ready:

- [ ] JWT_SECRET is a strong, random 32+ character string
- [ ] CORS_ORIGIN includes your Android app domain (if applicable)
- [ ] Test all endpoints work correctly
- [ ] Verify error responses don't leak sensitive information
- [ ] Monitor Vercel logs for any warnings
- [ ] Consider adding rate limiting (future feature)
- [ ] Set up error tracking/logging service (future)

## Updating the API

To deploy updates:

```bash
git add .
git commit -m "Feature: Add new endpoints"
git push origin main
```

Vercel automatically redeploys on every push to `main` branch.

## Vercel-Specific Features

### Serverless Functions

The API is deployed as a Node.js serverless function. Important details:

- **Cold starts**: First request may have slight delay (~100-200ms)
- **Request timeout**: 60 seconds (sufficient for this API)
- **Memory**: 1GB available (plenty for in-memory store)
- **Scaling**: Automatic scaling included

### Monitoring & Analytics

Vercel dashboard provides:

- Real-time deployment status
- Build logs
- Request analytics
- Error tracking
- Performance metrics

## Troubleshooting

### Build Fails

Check Vercel build logs:

1. Go to your Vercel dashboard
2. Select your project
3. Click **"Deployments"**
4. Click the failed deployment
5. View build logs for errors

Common issues:

| Error | Solution |
| --- | --- |
| `ENOENT: no such file` | Ensure all source files are committed to GitHub |
| `Cannot find module` | Run `npm install` locally and verify dependencies |
| `npm ERR! code EACCES` | File permissions issue - check file ownership |

### API Not Responding

- Verify environment variables are set in Vercel dashboard
- Check that JWT_SECRET is defined
- Review application logs in Vercel

## Custom Domain

To use your own domain:

1. Vercel dashboard → Project settings
2. Click **"Domains"**
3. Enter your custom domain
4. Follow Vercel's DNS instructions
5. DNS propagation takes 5-48 hours

## Rollback Deployment

To revert to a previous version:

1. Go to **"Deployments"** in Vercel dashboard
2. Find the deployment you want to restore
3. Click menu (•••) → **"Promote to Production"**

## Environment-Specific Configuration

### For multiple environments:

Create separate branches:

```bash
# Development branch
git checkout -b develop
# Make changes, commit, push to develop

# Create Vercel preview deployments for testing
# Production deployments happen on main branch
```

Vercel automatically creates preview deployments for pull requests.

## Next Steps

After successful deployment:

1. **Test from Android**: Use the deployed API URL in your Android app
2. **Monitor**: Check Vercel dashboard for performance
3. **Iterate**: Deploy new features with `git push`
4. **Scale**: Add database, auth, etc., as needed

## Documentation

- [Vercel Documentation](https://vercel.com/docs)
- [Vercel Node.js Runtime](https://vercel.com/docs/functions/nodejs)
- [Environment Variables Guide](https://vercel.com/docs/projects/environment-variables)

## Support

For Vercel-specific issues:
- Check [Vercel Status Page](https://www.vercel-status.com/)
- Search [Vercel Community](https://github.com/vercel/vercel/discussions)
- Email: support@vercel.com
