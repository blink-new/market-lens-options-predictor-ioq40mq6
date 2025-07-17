import { useQuery } from '@tanstack/react-query'

interface StockData {
  symbol: string
  companyName: string
  currentPrice: number
  change: number
  changePercent: number
  marketCap: number
  volume: number
  high52Week: number
  low52Week: number
  historicalData: Array<{
    date: string
    price: number
    volume: number
  }>
  prediction: {
    nextDay: number
    nextWeek: number
    nextMonth: number
    confidence: number
    trend: 'bullish' | 'bearish' | 'neutral'
  }
  technicalIndicators: {
    rsi: number
    macd: {
      value: number
      signal: number
      histogram: number
    }
    bollinger: {
      upper: number
      middle: number
      lower: number
    }
    sma20: number
    sma50: number
    sma200: number
    volume: number
    avgVolume: number
  }
  aiAnalysis: {
    overallRating: 'Strong Buy' | 'Buy' | 'Hold' | 'Sell' | 'Strong Sell'
    confidence: number
    riskLevel: 'Low' | 'Medium' | 'High'
    priceTarget: number
    keyFactors: string[]
    sentiment: {
      score: number
      label: 'Very Positive' | 'Positive' | 'Neutral' | 'Negative' | 'Very Negative'
    }
    technicalScore: number
    fundamentalScore: number
    marketScore: number
  }
}

// Mock data generator for demonstration
const generateMockStockData = (symbol: string): StockData => {
  const basePrice = Math.random() * 200 + 50
  const change = (Math.random() - 0.5) * 10
  const changePercent = (change / basePrice) * 100

  // Generate historical data
  const historicalData = []
  let price = basePrice
  for (let i = 30; i >= 0; i--) {
    const date = new Date()
    date.setDate(date.getDate() - i)
    price += (Math.random() - 0.5) * 5
    historicalData.push({
      date: date.toISOString().split('T')[0],
      price: Math.max(price, 10),
      volume: Math.floor(Math.random() * 10000000) + 1000000
    })
  }

  const currentPrice = historicalData[historicalData.length - 1].price
  const rsi = Math.random() * 100
  const macdValue = (Math.random() - 0.5) * 2
  const macdSignal = (Math.random() - 0.5) * 2

  return {
    symbol,
    companyName: getCompanyName(symbol),
    currentPrice,
    change,
    changePercent,
    marketCap: Math.floor(Math.random() * 1000000000000) + 10000000000,
    volume: Math.floor(Math.random() * 100000000) + 1000000,
    high52Week: currentPrice * (1 + Math.random() * 0.5),
    low52Week: currentPrice * (1 - Math.random() * 0.3),
    historicalData,
    prediction: {
      nextDay: currentPrice * (1 + (Math.random() - 0.5) * 0.05),
      nextWeek: currentPrice * (1 + (Math.random() - 0.5) * 0.1),
      nextMonth: currentPrice * (1 + (Math.random() - 0.5) * 0.2),
      confidence: Math.floor(Math.random() * 30) + 70,
      trend: Math.random() > 0.5 ? 'bullish' : Math.random() > 0.3 ? 'bearish' : 'neutral'
    },
    technicalIndicators: {
      rsi,
      macd: {
        value: macdValue,
        signal: macdSignal,
        histogram: macdValue - macdSignal
      },
      bollinger: {
        upper: currentPrice * 1.05,
        middle: currentPrice,
        lower: currentPrice * 0.95
      },
      sma20: currentPrice * (1 + (Math.random() - 0.5) * 0.02),
      sma50: currentPrice * (1 + (Math.random() - 0.5) * 0.05),
      sma200: currentPrice * (1 + (Math.random() - 0.5) * 0.1),
      volume: Math.floor(Math.random() * 100000000) + 1000000,
      avgVolume: Math.floor(Math.random() * 80000000) + 5000000
    },
    aiAnalysis: {
      overallRating: getRandomRating(),
      confidence: Math.floor(Math.random() * 30) + 70,
      riskLevel: getRandomRisk(),
      priceTarget: currentPrice * (1 + (Math.random() - 0.3) * 0.3),
      keyFactors: generateKeyFactors(symbol),
      sentiment: {
        score: Math.floor(Math.random() * 100),
        label: getRandomSentiment()
      },
      technicalScore: Math.floor(Math.random() * 40) + 60,
      fundamentalScore: Math.floor(Math.random() * 40) + 60,
      marketScore: Math.floor(Math.random() * 40) + 60
    }
  }
}

const getCompanyName = (symbol: string): string => {
  const companies: Record<string, string> = {
    'AAPL': 'Apple Inc.',
    'MSFT': 'Microsoft Corporation',
    'GOOGL': 'Alphabet Inc.',
    'AMZN': 'Amazon.com Inc.',
    'TSLA': 'Tesla Inc.',
    'NVDA': 'NVIDIA Corporation',
    'META': 'Meta Platforms Inc.',
    'NFLX': 'Netflix Inc.',
    'SPY': 'SPDR S&P 500 ETF Trust',
    'QQQ': 'Invesco QQQ Trust'
  }
  return companies[symbol] || `${symbol} Corporation`
}

const getRandomRating = (): 'Strong Buy' | 'Buy' | 'Hold' | 'Sell' | 'Strong Sell' => {
  const ratings = ['Strong Buy', 'Buy', 'Hold', 'Sell', 'Strong Sell'] as const
  return ratings[Math.floor(Math.random() * ratings.length)]
}

const getRandomRisk = (): 'Low' | 'Medium' | 'High' => {
  const risks = ['Low', 'Medium', 'High'] as const
  return risks[Math.floor(Math.random() * risks.length)]
}

const getRandomSentiment = (): 'Very Positive' | 'Positive' | 'Neutral' | 'Negative' | 'Very Negative' => {
  const sentiments = ['Very Positive', 'Positive', 'Neutral', 'Negative', 'Very Negative'] as const
  return sentiments[Math.floor(Math.random() * sentiments.length)]
}

const generateKeyFactors = (symbol: string): string[] => {
  const factors = [
    `Strong quarterly earnings growth for ${symbol} exceeded analyst expectations`,
    'Technical indicators show bullish momentum with RSI in favorable range',
    'Market sentiment remains positive despite recent volatility',
    'Institutional buying activity has increased significantly',
    'Sector rotation favoring technology stocks continues',
    'Options flow indicates bullish positioning by large traders',
    'Revenue growth trajectory remains strong year-over-year',
    'Management guidance for next quarter appears conservative',
    'Competitive positioning in the market has strengthened',
    'Macroeconomic factors support continued growth'
  ]
  
  // Return 4-6 random factors
  const shuffled = factors.sort(() => 0.5 - Math.random())
  return shuffled.slice(0, Math.floor(Math.random() * 3) + 4)
}

const fetchStockData = async (symbol: string): Promise<StockData> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000))
  
  // Simulate occasional errors
  if (Math.random() < 0.1) {
    throw new Error('Failed to fetch stock data')
  }
  
  return generateMockStockData(symbol)
}

export const useStockData = (symbol: string) => {
  return useQuery({
    queryKey: ['stock', symbol],
    queryFn: () => fetchStockData(symbol),
    enabled: !!symbol,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2
  })
}