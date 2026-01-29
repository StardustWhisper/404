import { useState, useEffect } from 'react'
import { Row, Col, Spin, ConfigProvider, Button } from 'antd'
import {
  CloudOutlined,
  PictureOutlined,
  ReadOutlined,
  HomeOutlined,
  ReloadOutlined,
  WarningOutlined,
  CodeOutlined,
  ThunderboltOutlined,
  SunOutlined,
  MoonOutlined
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
  const [theme, setTheme] = useState(() => {
    // Load theme from localStorage or default to light
    return localStorage.getItem('theme') || 'light'
  })
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

    // Parallel API requests using Promise.allSettled for better performance
    const unsplashKey = import.meta.env.VITE_UNSPLASH_API_KEY || ''
    const weatherKey = import.meta.env.VITE_WEATHER_API_KEY || ''
    const newsKey = import.meta.env.VITE_NEWS_API_KEY || ''

    const results = await Promise.allSettled([
      // Fetch Image
      (async () => {
        if (unsplashKey && !unsplashKey.includes('YOUR_')) {
          const imgRes = await axios.get(`https://api.unsplash.com/photos/random?client_id=${unsplashKey}&orientation=landscape&w=1200&h=800`, { timeout: 2000 })
          return imgRes.data.urls.regular
        }
        return null
      })(),
      // Fetch Weather
      (async () => {
        if (weatherKey && !weatherKey.includes('YOUR_')) {
          const weatherRes = await axios.get(`https://api.weatherapi.com/v1/current.json?key=${weatherKey}&q=auto:ip`, { timeout: 2000 })
          return weatherRes.data
        }
        return null
      })(),
      // Fetch News
      (async () => {
        if (newsKey && !newsKey.includes('YOUR_')) {
          const newsRes = await axios.get(`https://newsapi.org/v2/top-headlines?country=us&category=technology&apiKey=${newsKey}`, { timeout: 2000 })
          if (newsRes.data.articles && newsRes.data.articles.length > 0) {
            return newsRes.data.articles[0]
          }
        }
        return null
      })(),
      // Fetch Quote (no API key needed)
      (async () => {
        const quoteRes = await axios.get('https://api.quotable.io/random', { timeout: 2000 })
        return quoteRes.data
      })()
    ])

    // Process results
    if (results[0].status === 'fulfilled' && results[0].value) {
      newData.imageUrl = results[0].value
    } else {
      console.log('Using mock image')
    }

    if (results[1].status === 'fulfilled' && results[1].value) {
      newData.weather = results[1].value
    } else {
      console.log('Using mock weather')
    }

    if (results[2].status === 'fulfilled' && results[2].value) {
      newData.news = results[2].value
    } else {
      console.log('Using mock news')
    }

    if (results[3].status === 'fulfilled' && results[3].value) {
      newData.quote = results[3].value
    } else {
      console.log('Using mock quote')
    }

    setData(newData)
    setLoading(false)
  }

  useEffect(() => {
    fetchData()
  }, [])

  // Theme management
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('theme', theme)
  }, [theme])

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light')
  }

  const handleGoHome = () => {
    window.location.href = '/'
  }

  return (
    <ConfigProvider
      theme={{
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
              <div style={{ display: 'flex', gap: '1rem' }}>
                <button className="btn-icon" onClick={toggleTheme} aria-label="Toggle theme">
                  {theme === 'light' ? <MoonOutlined /> : <SunOutlined />}
                </button>
                <button className="btn-primary" onClick={handleGoHome}>
                  <HomeOutlined /> Back to Home
                </button>
              </div>
            </div>

            <Row gutter={[24, 24]} align="stretch">
              {/* Left Col: Weather & Quote */}
              <Col xs={24} sm={24} md={8} lg={6} xl={6} style={{ display: 'flex', flexDirection: 'column' }}>
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
              <Col xs={24} sm={24} md={16} lg={12} xl={12} style={{ display: 'flex' }}>
                <div className="fresh-card visual-card" style={{ flex: 1, position: 'relative' }}>
                   <div className="visual-badge">
                      <PictureOutlined style={{ marginRight: '8px' }} />
                      Visual Feed
                   </div>
                   <img src={data.imageUrl} alt="Visual Feed" className="visual-img" loading="lazy" fetchPriority="low" />
                </div>
              </Col>

              {/* Right Col: News & Actions */}
              <Col xs={24} sm={24} md={24} lg={6} xl={6} style={{ display: 'flex', flexDirection: 'column' }}>
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
