import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Badge } from './ui/badge'
import { Progress } from './ui/progress'
import { TrendingUp, TrendingDown, Minus, Activity, BarChart3, Target } from 'lucide-react'

interface StockData {
  symbol: string
  currentPrice: number
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
}

interface TechnicalIndicatorsProps {
  data: StockData
}

export function TechnicalIndicators({ data }: TechnicalIndicatorsProps) {
  const { technicalIndicators: tech, currentPrice } = data

  const getRSISignal = (rsi: number) => {
    if (rsi > 70) return { signal: 'Overbought', color: 'text-red-600 bg-red-50 border-red-200', icon: <TrendingDown className="h-4 w-4" /> }
    if (rsi < 30) return { signal: 'Oversold', color: 'text-green-600 bg-green-50 border-green-200', icon: <TrendingUp className="h-4 w-4" /> }
    return { signal: 'Neutral', color: 'text-yellow-600 bg-yellow-50 border-yellow-200', icon: <Minus className="h-4 w-4" /> }
  }

  const getMACDSignal = (macd: number, signal: number) => {
    if (macd > signal) return { signal: 'Bullish', color: 'text-green-600 bg-green-50 border-green-200', icon: <TrendingUp className="h-4 w-4" /> }
    if (macd < signal) return { signal: 'Bearish', color: 'text-red-600 bg-red-50 border-red-200', icon: <TrendingDown className="h-4 w-4" /> }
    return { signal: 'Neutral', color: 'text-yellow-600 bg-yellow-50 border-yellow-200', icon: <Minus className="h-4 w-4" /> }
  }

  const getBollingerSignal = (price: number, upper: number, lower: number) => {
    if (price > upper) return { signal: 'Overbought', color: 'text-red-600 bg-red-50 border-red-200' }
    if (price < lower) return { signal: 'Oversold', color: 'text-green-600 bg-green-50 border-green-200' }
    return { signal: 'Normal Range', color: 'text-blue-600 bg-blue-50 border-blue-200' }
  }

  const getSMASignal = (price: number, sma: number) => {
    const diff = ((price - sma) / sma) * 100
    if (diff > 2) return { signal: 'Above SMA', color: 'text-green-600 bg-green-50 border-green-200', icon: <TrendingUp className="h-4 w-4" /> }
    if (diff < -2) return { signal: 'Below SMA', color: 'text-red-600 bg-red-50 border-red-200', icon: <TrendingDown className="h-4 w-4" /> }
    return { signal: 'Near SMA', color: 'text-yellow-600 bg-yellow-50 border-yellow-200', icon: <Minus className="h-4 w-4" /> }
  }

  const getVolumeSignal = (volume: number, avgVolume: number) => {
    const ratio = volume / avgVolume
    if (ratio > 1.5) return { signal: 'High Volume', color: 'text-green-600 bg-green-50 border-green-200' }
    if (ratio < 0.5) return { signal: 'Low Volume', color: 'text-red-600 bg-red-50 border-red-200' }
    return { signal: 'Normal Volume', color: 'text-blue-600 bg-blue-50 border-blue-200' }
  }

  const rsiSignal = getRSISignal(tech.rsi)
  const macdSignal = getMACDSignal(tech.macd.value, tech.macd.signal)
  const bollingerSignal = getBollingerSignal(currentPrice, tech.bollinger.upper, tech.bollinger.lower)
  const sma20Signal = getSMASignal(currentPrice, tech.sma20)
  const sma50Signal = getSMASignal(currentPrice, tech.sma50)
  const sma200Signal = getSMASignal(currentPrice, tech.sma200)
  const volumeSignal = getVolumeSignal(tech.volume, tech.avgVolume)

  return (
    <div className="space-y-6">
      {/* Technical Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Technical Analysis Overview
          </CardTitle>
          <CardDescription>
            Key technical indicators and signals for {data.symbol}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">RSI (14)</span>
                <Badge className={rsiSignal.color}>
                  {rsiSignal.icon}
                  <span className="ml-1">{rsiSignal.signal}</span>
                </Badge>
              </div>
              <div className="space-y-1">
                <Progress value={tech.rsi} className="h-2" />
                <div className="text-xs text-muted-foreground text-right">{tech.rsi.toFixed(1)}</div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">MACD</span>
                <Badge className={macdSignal.color}>
                  {macdSignal.icon}
                  <span className="ml-1">{macdSignal.signal}</span>
                </Badge>
              </div>
              <div className="text-xs space-y-1">
                <div>MACD: {tech.macd.value.toFixed(3)}</div>
                <div>Signal: {tech.macd.signal.toFixed(3)}</div>
                <div>Histogram: {tech.macd.histogram.toFixed(3)}</div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Bollinger Bands</span>
                <Badge className={bollingerSignal.color}>
                  {bollingerSignal.signal}
                </Badge>
              </div>
              <div className="text-xs space-y-1">
                <div>Upper: ${tech.bollinger.upper.toFixed(2)}</div>
                <div>Middle: ${tech.bollinger.middle.toFixed(2)}</div>
                <div>Lower: ${tech.bollinger.lower.toFixed(2)}</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Moving Averages */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Moving Averages
          </CardTitle>
          <CardDescription>
            Simple Moving Average analysis and trend signals
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-medium">SMA 20</span>
                <Badge className={sma20Signal.color}>
                  {sma20Signal.icon}
                  <span className="ml-1">{sma20Signal.signal}</span>
                </Badge>
              </div>
              <div className="text-2xl font-bold">${tech.sma20.toFixed(2)}</div>
              <div className={`text-sm ${
                currentPrice > tech.sma20 ? 'text-green-600' : 'text-red-600'
              }`}>
                {currentPrice > tech.sma20 ? '+' : ''}
                {(((currentPrice - tech.sma20) / tech.sma20) * 100).toFixed(2)}%
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-medium">SMA 50</span>
                <Badge className={sma50Signal.color}>
                  {sma50Signal.icon}
                  <span className="ml-1">{sma50Signal.signal}</span>
                </Badge>
              </div>
              <div className="text-2xl font-bold">${tech.sma50.toFixed(2)}</div>
              <div className={`text-sm ${
                currentPrice > tech.sma50 ? 'text-green-600' : 'text-red-600'
              }`}>
                {currentPrice > tech.sma50 ? '+' : ''}
                {(((currentPrice - tech.sma50) / tech.sma50) * 100).toFixed(2)}%
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-medium">SMA 200</span>
                <Badge className={sma200Signal.color}>
                  {sma200Signal.icon}
                  <span className="ml-1">{sma200Signal.signal}</span>
                </Badge>
              </div>
              <div className="text-2xl font-bold">${tech.sma200.toFixed(2)}</div>
              <div className={`text-sm ${
                currentPrice > tech.sma200 ? 'text-green-600' : 'text-red-600'
              }`}>
                {currentPrice > tech.sma200 ? '+' : ''}
                {(((currentPrice - tech.sma200) / tech.sma200) * 100).toFixed(2)}%
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Volume Analysis */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Volume Analysis
          </CardTitle>
          <CardDescription>
            Trading volume compared to average volume
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="font-medium">Volume Signal</span>
              <Badge className={volumeSignal.color}>
                {volumeSignal.signal}
              </Badge>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <div className="text-sm text-muted-foreground">Current Volume</div>
                <div className="text-2xl font-bold">{(tech.volume / 1e6).toFixed(1)}M</div>
              </div>
              
              <div className="space-y-2">
                <div className="text-sm text-muted-foreground">Average Volume</div>
                <div className="text-2xl font-bold">{(tech.avgVolume / 1e6).toFixed(1)}M</div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Volume Ratio</span>
                <span>{(tech.volume / tech.avgVolume).toFixed(2)}x</span>
              </div>
              <Progress 
                value={Math.min((tech.volume / tech.avgVolume) * 50, 100)} 
                className="h-2"
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}