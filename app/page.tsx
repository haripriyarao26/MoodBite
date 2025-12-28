'use client'

import { useState, useEffect } from 'react'
import {
  Card,
  Input,
  Select,
  Button,
  Space,
  Typography,
  Divider,
  Alert,
  Spin,
  Tag,
  Row,
  Col,
} from 'antd'
import {
  HeartOutlined,
  ClockCircleOutlined,
  ThunderboltOutlined,
  SearchOutlined,
  HistoryOutlined,
} from '@ant-design/icons'
import { getFoodRecommendation } from '@/lib/ai-provider'
import { getUserPreferences, saveUserPreference } from '@/lib/storage'

const { Title, Text, Paragraph } = Typography
const { TextArea } = Input

export default function Home() {
  const [moodText, setMoodText] = useState('')
  const [timeOfDay, setTimeOfDay] = useState<string>('')
  const [energyLevel, setEnergyLevel] = useState<string>('')
  const [dietaryPreference, setDietaryPreference] = useState<string>('')
  const [loading, setLoading] = useState(false)
  const [recommendation, setRecommendation] = useState<any>(null)
  const [error, setError] = useState<string>('')
  const [preferences, setPreferences] = useState<string[]>([])

  useEffect(() => {
    // Load user preferences from localStorage
    const savedPrefs = getUserPreferences()
    setPreferences(savedPrefs)
  }, [])

  const handleGetRecommendation = async () => {
    if (!moodText.trim() && !timeOfDay && !energyLevel) {
      setError('Please provide at least your mood or some context')
      return
    }

    setLoading(true)
    setError('')
    setRecommendation(null)

    try {
      const userPrefs = preferences.length > 0 
        ? `User preferences: ${preferences.join(', ')}. ` 
        : ''

      const result = await getFoodRecommendation({
        moodText,
        timeOfDay,
        energyLevel,
        dietaryPreference,
        userPreferences: userPrefs,
      })

      setRecommendation(result)

      // Save dietary preference if provided
      if (dietaryPreference && !preferences.includes(dietaryPreference)) {
        saveUserPreference(dietaryPreference)
        setPreferences([...preferences, dietaryPreference])
      }
    } catch (err: any) {
      setError(err.message || 'Failed to get recommendation. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const timeOptions = [
    { label: 'Morning (6am - 12pm)', value: 'morning' },
    { label: 'Afternoon (12pm - 5pm)', value: 'afternoon' },
    { label: 'Evening (5pm - 9pm)', value: 'evening' },
    { label: 'Night (9pm - 6am)', value: 'night' },
  ]

  const energyOptions = [
    { label: 'High Energy', value: 'high' },
    { label: 'Medium Energy', value: 'medium' },
    { label: 'Low Energy', value: 'low' },
  ]

  const dietaryOptions = [
    { label: 'Vegetarian', value: 'vegetarian' },
    { label: 'Vegan', value: 'vegan' },
    { label: 'Non-vegetarian', value: 'non-vegetarian' },
    { label: 'South Indian', value: 'south indian' },
    { label: 'North Indian', value: 'north indian' },
    { label: 'No preference', value: 'none' },
  ]

  return (
    <div style={{ minHeight: '100vh', padding: '40px 20px' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <Title level={1} style={{ color: '#fff', marginBottom: '10px' }}>
            🍛 MoodBite
          </Title>
          <Text style={{ color: '#fff', fontSize: '18px' }}>
            Your mood-driven food recommendation agent
          </Text>
        </div>

        <Card
          style={{
            borderRadius: '16px',
            boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
            marginBottom: '24px',
          }}
        >
          <Space direction="vertical" size="large" style={{ width: '100%' }}>
            <div>
              <Title level={4}>
                <HeartOutlined /> How are you feeling?
              </Title>
              <TextArea
                placeholder="e.g., It's 9pm, I'm homesick and tired..."
                value={moodText}
                onChange={(e) => setMoodText(e.target.value)}
                rows={3}
                style={{ marginTop: '8px' }}
              />
              <Text type="secondary" style={{ fontSize: '12px', display: 'block', marginTop: '4px' }}>
                Describe your mood, situation, or what you're craving
              </Text>
            </div>

            <Row gutter={16}>
              <Col xs={24} sm={12}>
                <div>
                  <Text strong>
                    <ClockCircleOutlined /> Time of Day
                  </Text>
                  <Select
                    placeholder="Select time"
                    value={timeOfDay}
                    onChange={setTimeOfDay}
                    style={{ width: '100%', marginTop: '8px' }}
                    options={timeOptions}
                  />
                </div>
              </Col>
              <Col xs={24} sm={12}>
                <div>
                  <Text strong>
                    <ThunderboltOutlined /> Energy Level
                  </Text>
                  <Select
                    placeholder="Select energy level"
                    value={energyLevel}
                    onChange={setEnergyLevel}
                    style={{ width: '100%', marginTop: '8px' }}
                    options={energyOptions}
                  />
                </div>
              </Col>
            </Row>

            <div>
              <Text strong>Dietary Preference</Text>
              <Select
                placeholder="Select dietary preference (optional)"
                value={dietaryPreference}
                onChange={setDietaryPreference}
                style={{ width: '100%', marginTop: '8px' }}
                options={dietaryOptions}
                allowClear
              />
            </div>

            {preferences.length > 0 && (
              <div>
                <Text type="secondary" style={{ fontSize: '12px' }}>
                  <HistoryOutlined /> Your saved preferences:
                </Text>
                <div style={{ marginTop: '8px' }}>
                  {preferences.map((pref, idx) => (
                    <Tag key={idx} color="blue" style={{ marginBottom: '4px' }}>
                      {pref}
                    </Tag>
                  ))}
                </div>
              </div>
            )}

            <Button
              type="primary"
              size="large"
              icon={<SearchOutlined />}
              onClick={handleGetRecommendation}
              loading={loading}
              block
              style={{ height: '48px', fontSize: '16px' }}
            >
              Get Food Recommendation
            </Button>

            {error && (
              <Alert
                message="Error"
                description={error}
                type="error"
                showIcon
                closable
                onClose={() => setError('')}
              />
            )}
          </Space>
        </Card>

        {loading && (
          <Card style={{ textAlign: 'center', padding: '40px' }}>
            <Spin size="large" />
            <div style={{ marginTop: '16px' }}>
              <Text>Analyzing your mood and finding the perfect meal...</Text>
            </div>
          </Card>
        )}

        {recommendation && !loading && (
          <Card
            style={{
              borderRadius: '16px',
              boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
              background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
            }}
          >
            <Space direction="vertical" size="large" style={{ width: '100%' }}>
              <div>
                <Tag color="red" style={{ fontSize: '14px', padding: '4px 12px', marginBottom: '12px' }}>
                  {recommendation.category}
                </Tag>
                <Title level={2} style={{ margin: 0 }}>
                  {recommendation.dish}
                </Title>
              </div>

              <Divider />

              <div>
                <Title level={4}>Why this dish?</Title>
                <Paragraph style={{ fontSize: '16px', lineHeight: '1.8' }}>
                  {recommendation.reason}
                </Paragraph>
              </div>

              {recommendation.recipe && (
                <div>
                  <Title level={4}>Quick Recipe</Title>
                  <Paragraph style={{ fontSize: '16px', lineHeight: '1.8', whiteSpace: 'pre-line' }}>
                    {recommendation.recipe}
                  </Paragraph>
                </div>
              )}

              {recommendation.ordering && (
                <div>
                  <Title level={4}>Ordering Suggestion</Title>
                  <Paragraph style={{ fontSize: '16px', lineHeight: '1.8' }}>
                    {recommendation.ordering}
                  </Paragraph>
                </div>
              )}

              <Button
                onClick={() => {
                  setRecommendation(null)
                  setMoodText('')
                }}
                block
              >
                Get Another Recommendation
              </Button>
            </Space>
          </Card>
        )}
      </div>
    </div>
  )
}

