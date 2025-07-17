import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts'
import { Badge } from './ui/badge'
import { TrendingUp, TrendingDown } from 'lucide-react'

interface StockData {
  symbol: string
  currentPrice: number
  change: number
  changePercent: number
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
}

interface StockChartProps {
  data: StockData
}

export function StockChart({ data }: StockChartProps) {
  const chartData = data.historicalData.map((item, index) => ({
    ...item,
    predicted: index >= data.historicalData.length - 5 ? item.price * (1 + (Math.random() - 0.5) * 0.02) : null
  }))

  // Add prediction points
  const predictionData = [
    ...chartData,
    {
      date: 'Tomorrow',
      price: data.prediction.nextDay,
      predicted: data.prediction.nextDay,
      volume: 0
    },
    {
      date: 'Next Week',
      price: data.prediction.nextWeek,
      predicted: data.prediction.nextWeek,
      volume: 0
    },
    {
      date: 'Next Month',
      price: data.prediction.nextMonth,
      predicted: data.prediction.nextMonth,
      volume: 0
    }
  ]

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'bullish': return 'text-green-600 bg-green-50 border-green-200'
      case 'bearish': return 'text-red-600 bg-red-50 border-red-200'
      default: return 'text-yellow-600 bg-yellow-50 border-yellow-200'
    }
  }

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'bullish': return <TrendingUp className="h-4 w-4" />
      case 'bearish': return <TrendingDown className="h-4 w-4" />
      default: return <TrendingUp className="h-4 w-4" />
    }
  }

  return (
    <div className="space-y-6">
      {/* Price Chart */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Price Chart & AI Predictions</CardTitle>
              <CardDescription>Historical prices with AI-powered forecasts</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Badge className={getTrendColor(data.prediction.trend)}>
                {getTrendIcon(data.prediction.trend)}
                <span className="ml-1 capitalize">{data.prediction.trend}</span>
              </Badge>
              <Badge variant="outline">
                {data.prediction.confidence}% Confidence
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={predictionData}>
                <defs>
                  <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorPrediction" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis 
                  dataKey="date" 
                  tick={{ fontSize: 12 }}
                  tickFormatter={(value) => {
                    if (value.includes('-')) {
                      return new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
                    }
                    return value
                  }}
                />
                <YAxis 
                  tick={{ fontSize: 12 }}
                  tickFormatter={(value) => `$${value.toFixed(0)}`}
                />
                <Tooltip 
                  formatter={(value: number, name: string) => [
                    `$${value.toFixed(2)}`,
                    name === 'price' ? 'Historical Price' : 'AI Prediction'
                  ]}
                  labelFormatter={(label) => {
                    if (typeof label === 'string' && label.includes('-')) {
                      return new Date(label).toLocaleDateString('en-US', { 
                        weekday: 'short',
                        month: 'short', 
                        day: 'numeric' 
                      })
                    }
                    return label
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="price"
                  stroke="#3B82F6"
                  strokeWidth={2}
                  fill="url(#colorPrice)"
                  connectNulls={false}
                />
                <Area
                  type="monotone"
                  dataKey="predicted"
                  stroke="#10B981"
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  fill="url(#colorPrediction)"
                  connectNulls={false}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Prediction Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="text-center space-y-2">
              <div className="text-sm font-medium text-muted-foreground">Next Day Prediction</div>
              <div className="text-2xl font-bold text-blue-600">
                ${data.prediction.nextDay.toFixed(2)}
              </div>
              <div className={`text-sm ${
                data.prediction.nextDay > data.currentPrice ? 'text-green-600' : 'text-red-600'
              }`}>
                {data.prediction.nextDay > data.currentPrice ? '+' : ''}
                {((data.prediction.nextDay - data.currentPrice) / data.currentPrice * 100).toFixed(2)}%
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="text-center space-y-2">
              <div className="text-sm font-medium text-muted-foreground">Next Week Prediction</div>
              <div className="text-2xl font-bold text-purple-600">
                ${data.prediction.nextWeek.toFixed(2)}
              </div>
              <div className={`text-sm ${
                data.prediction.nextWeek > data.currentPrice ? 'text-green-600' : 'text-red-600'
              }`}>
                {data.prediction.nextWeek > data.currentPrice ? '+' : ''}
                {((data.prediction.nextWeek - data.currentPrice) / data.currentPrice * 100).toFixed(2)}%
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="text-center space-y-2">
              <div className="text-sm font-medium text-muted-foreground">Next Month Prediction</div>
              <div className="text-2xl font-bold text-indigo-600">
                ${data.prediction.nextMonth.toFixed(2)}
              </div>
              <div className={`text-sm ${
                data.prediction.nextMonth > data.currentPrice ? 'text-green-600' : 'text-red-600'
              }`}>
                {data.prediction.nextMonth > data.currentPrice ? '+' : ''}
                {((data.prediction.nextMonth - data.currentPrice) / data.currentPrice * 100).toFixed(2)}%
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}