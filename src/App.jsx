import { useState, useEffect } from 'react'
import { Row, Col, Spin, ConfigProvider, theme, Button } from 'antd'
import { 
  CloudOutlined, 
  PictureOutlined, 
  ReadOutlined, 
  HomeOutlined, 
  ReloadOutlined, 
  WarningOutlined,
  CodeOutlined,
  ThunderboltOutlined,
  GlobalOutlined
} from '@ant-design/icons'
import axios from 'axios'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import './App.css'

dayjs.extend(relativeTime)

// Mock Data for fallback
const MOCK_DATA = {
  image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80",
  weather: {
    current: {
      temp_c: 24.5,
      condition: { text: "Sunny" },
      humidity: 45,
      wind_kph: 12
    },
    location: { name: "California" }
  },
  news: {
    title: "The Future of Design: Minimalist & Clean Interfaces",
    publishedAt: new Date().toISOString(),
    source: { name: "DesignDaily" },
    url: "#"
  },
  quote: {
    content: "Simplicity is the ultimate sophistication.",
    author: "Leonardo da Vinci"
  }
}

function App() {
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState({
    imageUrl: '',
    weather: null,
    news: null,
    quote: null
  })

  const fetchData = async () => {
    setLoading(true)
    // Initialize with mock data as fallback
    let newData = { ...MOCK_DATA, imageUrl: MOCK_DATA.image }
    
    // Try to fetch Image
    try {
      if (!'YOUR_UNSPLASH_API_KEY'.includes('YOUR_')) {
          const imgRes = await axios.get('https://api.unsplash.com/photos/random?client_id=YOUR_UNSPLASH_API_KEY&orientation=landscape', { timeout: 2000 })
          newData.imageUrl = imgRes.data.urls.regular
      }
    } catch (e) {
      console.log('Using mock image')
    }

    // Try to fetch Weather
    try {
      if (!'YOUR_WEATHER_API_KEY'.includes('YOUR_')) {
          const weatherRes = await axios.get('https://api.weatherapi.com/v1/current.json?key=YOUR_WEATHER_API_KEY&q=auto:ip', { timeout: 2000 })
          newData.weather = weatherRes.data
      }
    } catch (e) {
      console.log('Using mock weather')
    }

    // Try to fetch News
    try {
      if (!'YOUR_NEWS_API_KEY'.includes('YOUR_')) {
          const newsRes = await axios.get('https://newsapi.org/v2/top-headlines?country=us&category=technology&apiKey=YOUR_NEWS_API_KEY', { timeout: 2000 })
          if (newsRes.data.articles && newsRes.data.articles.length > 0) {
            newData.news = newsRes.data.articles[0]
          }
      }
    } catch (e) {
      console.log('Using mock news')
    }

    // Try to fetch Quote
    try {
      const quoteRes = await axios.get('https://api.quotable.io/random', { timeout: 2000 })
      newData.quote = quoteRes.data
    } catch (e) {
       console.log('Using mock quote')
    }

    // Simulate a small delay for the loading animation effect
    setTimeout(() => {
        setData(newData)
        setLoading(false)
    }, 1000)
  }

  useEffect(() => {
    fetchData()
  }, [])

  const handleGoHome = () => {
    window.location.href = '/'
  }

  return (
    <ConfigProvider
      theme={{
        algorithm: theme.defaultAlgorithm,
        token: {
          colorPrimary: '#0EA5E9',
          fontFamily: "'Plus Jakarta Sans', sans-serif",
          borderRadius: 12
        },
      }}
    >
      <div className="dashboard-container">
        {loading ? (
          <div className="loading-container">
            <Spin size="large" />
          </div>
        ) : (
          <>
            <div className="header-section">
              <div className="brand-area">
                <div className="error-code">404</div>
                <div className="error-desc">
                  <div className="error-title">Page Not Found</div>
                  <div className="error-subtitle">The requested resource is unavailable.</div>
                </div>
              </div>
              <div>
                <button className="btn-primary" onClick={handleGoHome}>
                  <HomeOutlined /> Back to Home
                </button>
              </div>
            </div>

            <Row gutter={[24, 24]} align="stretch">
              {/* Left Col: Weather & Quote */}
              <Col xs={24} lg={6} style={{ display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', flex: 1 }}>
                  {/* Weather Card */}
                  <div className="fresh-card">
                    <div className="card-icon-wrapper">
                      <CloudOutlined />
                    </div>
                    <div className="card-title">Local Weather</div>
                    {data.weather && (
                      <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
                        <div className="weather-temp">{data.weather.current.temp_c}°</div>
                        <div style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
                           {data.weather.location.name}
                        </div>
                        <div className="weather-meta">
                           <div className="meta-item">
                              <span className="meta-label">Condition</span>
                              <span className="meta-value">{data.weather.current.condition.text}</span>
                           </div>
                           <div className="meta-item">
                              <span className="meta-label">Humidity</span>
                              <span className="meta-value">{data.weather.current.humidity}%</span>
                           </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Quote Card */}
                  <div className="fresh-card" style={{ flex: 1 }}>
                    <div className="card-icon-wrapper">
                      <CodeOutlined />
                    </div>
                    <div className="card-title">Daily Inspiration</div>
                    {data.quote && (
                      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', flex: 1 }}>
                        <div className="quote-text">
                          "{data.quote.content}"
                        </div>
                        <div className="quote-author">
                          <ThunderboltOutlined style={{ fontSize: '14px', color: 'var(--accent)' }} />
                          {data.quote.author}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </Col>

              {/* Middle Col: Image (Visual Feed) */}
              <Col xs={24} lg={12} style={{ display: 'flex' }}>
                <div className="fresh-card visual-card" style={{ flex: 1, position: 'relative' }}>
                   <div className="visual-badge">
                      <PictureOutlined style={{ marginRight: '8px' }} />
                      Visual Feed
                   </div>
                   <img src={data.imageUrl} alt="Visual Feed" className="visual-img" />
                </div>
              </Col>

              {/* Right Col: News & Actions */}
              <Col xs={24} lg={6} style={{ display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', flex: 1 }}>
                  {/* News Card */}
                  <div className="fresh-card" style={{ flex: 1 }}>
                    <div className="card-icon-wrapper">
                      <ReadOutlined />
                    </div>
                    <div className="card-title">Trending Now</div>
                    {data.news && (
                      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                         <div style={{ flex: 1 }}>
                            <a href={data.news.url} target="_blank" rel="noopener noreferrer" className="news-link">
                              {data.news.title}
                            </a>
                            <div className="news-source">
                              {data.news.source.name}
                            </div>
                            <div style={{ marginTop: '0.5rem', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                              {dayjs(data.news.publishedAt).fromNow()}
                            </div>
                         </div>
                         <div style={{ marginTop: 'auto', paddingTop: '1rem' }}>
                            <Button type="link" href={data.news.url} target="_blank" style={{ padding: 0, fontWeight: 600 }}>
                               Read Article &rarr;
                            </Button>
                         </div>
                      </div>
                    )}
                  </div>

                  {/* System Status / Refresh */}
                  <div className="fresh-card" style={{ height: 'auto' }}>
                     <div className="card-icon-wrapper">
                        <WarningOutlined />
                     </div>
                     <div className="card-title">System Status</div>
                     <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
                        <div>
                           <div className="meta-label">Server</div>
                           <div className="meta-value" style={{ color: '#22c55e' }}>Online</div>
                        </div>
                        <div>
                           <div className="meta-label">Ping</div>
                           <div className="meta-value">24ms</div>
                        </div>
                     </div>
                     <Button 
                        block 
                        icon={<ReloadOutlined />} 
                        onClick={fetchData}
                        style={{ borderRadius: '12px', height: '40px', fontWeight: 500 }}
                      >
                        Refresh Data
                      </Button>
                  </div>
                </div>
              </Col>
            </Row>
          </>
        )}
      </div>
    </ConfigProvider>
  )
}

export default App
