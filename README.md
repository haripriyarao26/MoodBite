# MoodBite 🍛

**Mood-Driven Food Agent** - Get personalized food recommendations based on your mood, time, and energy level.

<img width="1181" height="771" alt="image" src="https://github.com/user-attachments/assets/0bd867b6-b03a-4c17-8c62-23b886e2c303" />

<img width="1183" height="881" alt="image" src="https://github.com/user-attachments/assets/fa6aeb81-a1f2-40c4-994e-1d3862618d79" />



## Features

- 🎭 **Mood Analysis** - Describe how you're feeling or your situation
- ⏰ **Time-Aware** - Recommendations based on time of day
- ⚡ **Energy Level** - Considers your current energy level
- 🥗 **Dietary Preferences** - Supports vegetarian, vegan, and cultural preferences
- 💾 **Memory** - Remembers your preferences for better recommendations
- 🤖 **AI-Powered** - Uses Hugging Face AI models (completely free, no API key needed!)

## Tech Stack

- **Next.js 14** - React framework with App Router
- **Ant Design** - Beautiful UI components
- **Hugging Face Inference API** - Free AI models for intelligent food recommendations
- **TypeScript** - Type-safe code
- **GitHub Pages** - Free hosting platform

## Getting Started

### Prerequisites

- Node.js 18+ installed
- **No API keys required!** This app uses free Hugging Face models.

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd MoodBite
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

That's it! No API keys or configuration needed. 🎉

## Deployment to GitHub Pages

### Automatic Deployment (Recommended)

1. Push your code to GitHub
2. Go to your repository **Settings** → **Pages**
3. Under **Source**, select **GitHub Actions**
4. Push to the `main` branch - GitHub Actions will automatically build and deploy your site
5. Your site will be available at `https://<your-username>.github.io/<repository-name>/`

### Manual Deployment

1. Build the static site:
```bash
npm run build
```

2. The `out` folder contains your static site
3. Push the `out` folder contents to the `gh-pages` branch, or use GitHub Pages settings

### Alternative: Deploy to Vercel

If you prefer Vercel:
1. Push your code to GitHub
2. Import your repository in [Vercel](https://vercel.com)
3. Deploy!

Vercel will automatically detect Next.js and configure everything for you. No environment variables needed!

## Usage

1. Enter your mood or situation (e.g., "It's 9pm, I'm homesick and tired")
2. Optionally select time of day, energy level, and dietary preferences
3. Click "Get Food Recommendation"
4. The AI will analyze your mood and suggest the perfect meal with:
   - Food category (comfort, light, indulgent, etc.)
   - Specific dish recommendation
   - Reason why it fits your mood
   - Quick recipe or ordering suggestion

## Example

**Input:** "It's 9pm, I'm homesick and tired"

**Output:**
- **Category:** Comfort
- **Dish:** Upma or Dal-Rice
- **Reason:** "You want something familiar and warm. This will calm you down without draining energy."
- **Ordering:** "Order from your favorite South Indian restaurant or make a quick dal-rice at home."

## License

MIT
