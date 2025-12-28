// AI Provider using Hugging Face Inference API (completely free, no API key needed)

interface RecommendationInput {
  moodText: string
  timeOfDay: string
  energyLevel: string
  dietaryPreference: string
  userPreferences: string
}

interface RecommendationOutput {
  category: string
  dish: string
  reason: string
  recipe?: string
  ordering?: string
}

// Parse AI response and extract JSON
function parseAIResponse(text: string): RecommendationOutput | null {
  try {
    // Try to find JSON in the response
    let jsonText = text.trim()
    
    // Remove markdown code blocks
    if (jsonText.includes('```json')) {
      jsonText = jsonText.split('```json')[1].split('```')[0].trim()
    } else if (jsonText.includes('```')) {
      jsonText = jsonText.split('```')[1].split('```')[0].trim()
    }
    
    // Extract JSON object
    const jsonMatch = jsonText.match(/\{[\s\S]*\}/)
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0])
      if (parsed.dish && parsed.reason && parsed.category) {
        return parsed as RecommendationOutput
      }
    }
  } catch (e) {
    // Failed to parse
  }
  
  return null
}

// Use Hugging Face's free inference API
async function getFoodRecommendationHuggingFace(
  input: RecommendationInput
): Promise<RecommendationOutput> {
  const currentTime = new Date().toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: 'numeric',
  })

  const prompt = `You are a mood-driven food recommendation agent. Recommend a meal.

Context:
Mood: ${input.moodText || 'Not specified'}
Time: ${input.timeOfDay || 'Not specified'}
Energy: ${input.energyLevel || 'Not specified'}
Diet: ${input.dietaryPreference !== 'none' ? input.dietaryPreference : 'Any'}
Preferences: ${input.userPreferences || 'None'}
Current Time: ${currentTime}

Respond ONLY with valid JSON (no other text):
{
  "category": "comfort|light|indulgent|energizing|healthy|quick",
  "dish": "dish name",
  "reason": "2-3 sentence warm explanation",
  "recipe": "brief recipe steps or null",
  "ordering": "where to order or null"
}`

  // Use Hugging Face's free inference API with text generation models
  // Try multiple models until one works
  const models = [
    'gpt2',
    'distilgpt2',
  ]

  for (const modelName of models) {
    try {
      const response = await fetch(
        `https://api-inference.huggingface.co/models/${modelName}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            inputs: prompt,
            parameters: {
              max_new_tokens: 300,
              return_full_text: false,
              temperature: 0.8,
            },
          }),
        }
      )

      if (response.ok) {
        const data = await response.json()
        let text = ''
        
        if (Array.isArray(data) && data[0]?.generated_text) {
          text = data[0].generated_text
        } else if (data.generated_text) {
          text = data.generated_text
        } else if (typeof data === 'string') {
          text = data
        }

        if (text) {
          const parsed = parseAIResponse(text)
          if (parsed) {
            return parsed
          }
        }
      } else if (response.status === 503) {
        // Model loading, wait a bit and retry
        await new Promise(resolve => setTimeout(resolve, 3000))
        continue
      }
    } catch (error) {
      continue
    }
  }

  // If Hugging Face models fail, use intelligent fallback
  throw new Error('Hugging Face models are currently loading. Please try again in a moment.')
}

// Create intelligent recommendations based on patterns (fallback when AI models are unavailable)
function createSmartRecommendation(input: RecommendationInput): RecommendationOutput {
  const mood = input.moodText.toLowerCase()
  const isLowEnergy = input.energyLevel === 'low'
  const isEvening = input.timeOfDay === 'evening' || input.timeOfDay === 'night'
  const isMorning = input.timeOfDay === 'morning'
  const isComfort = mood.includes('tired') || mood.includes('sad') || mood.includes('homesick') || mood.includes('lonely')
  const isHappy = mood.includes('happy') || mood.includes('excited') || mood.includes('celebrat')
  const isStressed = mood.includes('stress') || mood.includes('anxious') || mood.includes('worried')
  
  let category = 'comfort'
  let dish = ''
  let reason = ''
  let recipe: string | undefined = undefined
  let ordering: string | undefined = undefined

  if (isComfort && isEvening) {
    category = 'comfort'
    dish = input.dietaryPreference === 'south indian' ? 'Upma with chutney' : 
           input.dietaryPreference === 'north indian' ? 'Dal Rice with pickle' : 
           'Dal Rice'
    reason = 'Something warm and familiar that will soothe your soul. This comfort food reminds you of home and will help you relax after a long day.'
    if (isLowEnergy) {
      ordering = 'Order from your favorite Indian restaurant - they usually have this ready quickly.'
    } else {
      recipe = '1. Cook basmati rice until fluffy. 2. Heat your favorite dal (toor or masoor). 3. Serve together with a side of pickle and papad.'
    }
  } else if (isLowEnergy && isEvening) {
    category = 'quick'
    dish = 'Maggi or Instant Noodles'
    reason = 'When you\'re tired and need something fast, nothing beats a quick bowl of noodles. It\'s ready in minutes and will give you the energy you need.'
    recipe = '1. Boil 2 cups water. 2. Add noodles and masala. 3. Cook for 2-3 minutes. 4. Serve hot with some chopped veggies if you have them.'
  } else if (isHappy && !isLowEnergy) {
    category = 'indulgent'
    dish = input.dietaryPreference === 'south indian' ? 'Masala Dosa with sambar' :
           input.dietaryPreference === 'north indian' ? 'Butter Chicken with Naan' :
           'Biryani'
    reason = 'You\'re in a good mood! Treat yourself to something special. This flavorful dish will match your energy and make your day even better.'
    ordering = 'Order from a good restaurant - you deserve it!'
  } else if (isStressed) {
    category = 'light'
    dish = 'Soup and Bread or Khichdi'
    reason = 'When you\'re stressed, your body needs something light and easy to digest. This simple meal will calm your mind and nourish your body without overwhelming you.'
    if (!isLowEnergy) {
      recipe = '1. Cook rice and lentils together. 2. Add turmeric and salt. 3. Serve hot with ghee. Simple and soothing.'
    } else {
      ordering = 'Order a light soup or khichdi from a nearby restaurant.'
    }
  } else if (isMorning) {
    category = 'energizing'
    dish = input.dietaryPreference === 'south indian' ? 'Idli with sambar' :
           'Poha or Upma'
    reason = 'Start your day right with a light, energizing breakfast. This will give you the fuel you need without making you feel heavy.'
    if (!isLowEnergy) {
      recipe = '1. Soak poha and drain. 2. Heat oil, add mustard seeds and curry leaves. 3. Add poha, turmeric, and salt. 4. Cook for 2-3 minutes. Serve with lemon.'
    }
  } else {
    category = 'healthy'
    dish = 'Bowl with rice, dal, vegetables, and salad'
    reason = 'A balanced meal that will nourish your body and keep you satisfied. Perfect for any time of day when you want something wholesome.'
    if (!isLowEnergy) {
      recipe = '1. Cook rice. 2. Prepare dal. 3. Steam or sauté vegetables. 4. Make a simple salad. 5. Serve everything together.'
    }
  }

  return {
    category,
    dish,
    reason,
    recipe,
    ordering,
  }
}

// Main function - uses Hugging Face AI models
export async function getFoodRecommendation(
  input: RecommendationInput
): Promise<RecommendationOutput> {
  // Try Hugging Face AI models first
  try {
    return await getFoodRecommendationHuggingFace(input)
  } catch (error: any) {
    // Fallback to smart pattern-based recommendation if AI models are unavailable
    console.log('Hugging Face models unavailable, using smart fallback...')
    return createSmartRecommendation(input)
  }
}
