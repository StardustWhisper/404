import { useState, useEffect } from 'react'
import { Card, Row, Col, Typography, Spin } from 'antd'
import axios from 'axios'
import dayjs from 'dayjs'
import './App.css'

const { Title, Text } = Typography

function App() {
  const [loading, setLoading] = useState(true)
  const [imageUrl, setImageUrl] = useState('')
  const [weather, setWeather] = useState(null)
  const [news, setNews] = useState(null)
  const [quote, setQuote] = useState(null)
  const [exchangeRate, setExchangeRate] = useState(null)
  const [locationPermission, setLocationPermission] = useState('prompt') // 'granted', 'denied', 'prompt'

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 获取随机图片 (使用免费的Lorem Picsum API，无需API密钥)
        const randomId = Math.floor(Math.random() * 1000)
        setImageUrl(`https://picsum.photos/seed/${randomId}/800/600.jpg`)

        // 获取用户位置并显示当地天气
        try {
          // 检查地理位置权限状态
          if ('permissions' in navigator) {
            const permission = await navigator.permissions.query({ name: 'geolocation' })
            setLocationPermission(permission.state)
          }
          
          // 获取用户位置
          const position = await new Promise((resolve, reject) => {
            if (!navigator.geolocation) {
              reject(new Error('浏览器不支持地理位置API'))
              return
            }
            
            navigator.geolocation.getCurrentPosition(
              (pos) => resolve(pos),
              (err) => reject(err),
              { timeout: 10000, enableHighAccuracy: true }
            )
          })
          
          const { latitude, longitude } = position.coords
          
          // 获取天气信息
          const weatherResponse = await axios.get(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`)
          
          // 获取位置名称 (使用免费的Nominatim反向地理编码API)
          let locationName = '未知位置'
          let countryName = ''
          try {
            const locationResponse = await axios.get(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&accept-language=zh-CN`)
            if (locationResponse.data && locationResponse.data.address) {
              const address = locationResponse.data.address
              locationName = address.city || address.town || address.village || address.county || '未知位置'
              countryName = address.country || ''
            }
          } catch (locationError) {
            console.error('获取位置名称失败:', locationError)
          }
          
          setWeather({
            location: {
              name: locationName,
              country: countryName
            },
            current: {
              temp_c: weatherResponse.data.current_weather.temperature,
              condition: {
                text: weatherResponse.data.current_weather.weathercode > 0 ? '多云' : '晴朗'
              }
            }
          })
        } catch (error) {
          console.error('获取位置或天气信息失败:', error)
          // 如果获取位置失败或用户拒绝，使用默认位置（北京）
          try {
            const weatherResponse = await axios.get('https://api.open-meteo.com/v1/forecast?latitude=39.9042&longitude=116.4074&current_weather=true')
            setWeather({
              location: {
                name: '北京',
                country: '中国'
              },
              current: {
                temp_c: weatherResponse.data.current_weather.temperature,
                condition: {
                  text: weatherResponse.data.current_weather.weathercode > 0 ? '多云' : '晴朗'
                }
              }
            })
          } catch {
            // 如果API也失败，使用模拟数据
            setWeather({
              location: {
                name: '北京',
                country: '中国'
              },
              current: {
                temp_c: Math.floor(Math.random() * 20 + 10),
                condition: {
                  text: '晴朗'
                }
              }
            })
          }
        }

        // 获取新闻 (使用免费的JSONPlaceholder API模拟新闻数据)
        try {
          const newsResponse = await axios.get('https://jsonplaceholder.typicode.com/posts/1')
          setNews({
            title: newsResponse.data.title,
            publishedAt: new Date().toISOString()
          })
        } catch {
          // 如果API失败，使用模拟数据
          setNews({
            title: '今日科技新闻：人工智能技术取得新突破',
            publishedAt: new Date().toISOString()
          })
        }

        // 获取名人名言
        try {
          const quoteResponse = await axios.get('https://api.quotable.io/random')
          setQuote(quoteResponse.data)
        } catch {
          // 如果API失败，使用模拟数据
          setQuote({
            content: '生活就像骑自行车，要保持平衡就得不断前进。',
            author: '阿尔伯特·爱因斯坦'
          })
        }

        // 获取USD/CNY汇率 (使用免费的汇率API，无需API密钥)
        try {
          // 使用ExchangeRate-API，提供免费且稳定的汇率数据
          const rateResponse = await axios.get('https://open.er-api.com/v6/latest/USD')
          setExchangeRate(rateResponse.data.rates.CNY)
        } catch {
          // 如果API失败，尝试备用API
          try {
            const backupResponse = await axios.get('https://api.exchangerate.host/latest?base=USD&symbols=CNY')
            setExchangeRate(backupResponse.data.rates.CNY)
          } catch {
            // 如果所有API都失败，使用模拟数据
            setExchangeRate((Math.random() * 0.2 + 7).toFixed(4))
          }
        }

        setLoading(false)
      } catch (error) {
        console.error('Error fetching data:', error)
        // 确保即使API失败也能显示一些内容
        if (!imageUrl) {
          const randomId = Math.floor(Math.random() * 1000)
          setImageUrl(`https://picsum.photos/seed/${randomId}/800/600.jpg`)
        }
        if (!weather) {
          setWeather({
            location: {
              name: '北京',
              country: '中国'
            },
            current: {
              temp_c: Math.floor(Math.random() * 20 + 10),
              condition: {
                text: '晴朗'
              }
            }
          })
        }
        if (!news) {
          setNews({
            title: '今日科技新闻：人工智能技术取得新突破',
            publishedAt: new Date().toISOString()
          })
        }
        if (!quote) {
          setQuote({
            content: '生活就像骑自行车，要保持平衡就得不断前进。',
            author: '阿尔伯特·爱因斯坦'
          })
        }
        if (!exchangeRate) {
          setExchangeRate((Math.random() * 0.2 + 7).toFixed(4))
        }
        setLoading(false)
      }
    }

    fetchData()
  }, [locationPermission])

  if (loading) {
    return <div className="loading-container"><Spin size="large" /></div>
  }

  return (
    <div className="container">
      <Title level={1}>404 - 页面未找到</Title>
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Card>
            <img src={imageUrl} alt="Random" className="random-image" />
          </Card>
        </Col>
        <Col span={6}>
          <Card title="当前天气">
            {weather && (
              <>
                <Text>{weather.location.name}, {weather.location.country}</Text>
                <br />
                <Text>温度: {weather.current.temp_c}°C</Text>
                <br />
                <Text>天气: {weather.current.condition.text}</Text>
                <br />
                <Text type="secondary" style={{ fontSize: '12px' }}>
                  {locationPermission === 'granted' ? '📍 基于您的位置' : '📍 默认位置'}
                </Text>
              </>
            )}
          </Card>
        </Col>
        <Col span={6}>
          <Card title="今日新闻">
            {news && (
              <>
                <Text strong>{news.title}</Text>
                <br />
                <Text type="secondary">{dayjs(news.publishedAt).format('YYYY-MM-DD HH:mm')}</Text>
              </>
            )}
          </Card>
        </Col>
        <Col span={6}>
          <Card title="每日名言">
            {quote && (
              <>
                <Text italic>"{quote.content}"</Text>
                <br />
                <Text type="secondary">— {quote.author}</Text>
              </>
            )}
          </Card>
        </Col>
        <Col span={6}>
          <Card title="USD/CNY 汇率">
            {exchangeRate && (
              <>
                <Text>1 USD = {exchangeRate} CNY</Text>
                <br />
                <Text type="secondary">更新时间: {dayjs().format('YYYY-MM-DD HH:mm:ss')}</Text>
              </>
            )}
          </Card>
        </Col>
      </Row>
    </div>
  )
}

export default App
