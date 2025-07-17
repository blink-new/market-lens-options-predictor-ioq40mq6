import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Badge } from './ui/badge'
import { Progress } from './ui/progress'
import { Brain, Target, AlertTriangle, TrendingUp, TrendingDown, Shield, Zap } from 'lucide-react'

interface StockData {
  symbol: string
  currentPrice: number
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

interface AIAnalysisProps {
  data: StockData
}

export function AIAnalysis({ data }: AIAnalysisProps) {
  const { aiAnalysis: ai, currentPrice } = data

  const getRatingColor = (rating: string) => {
    switch (rating) {
      case 'Strong Buy': return 'text-green-700 bg-green-100 border-green-300'
      case 'Buy': return 'text-green-600 bg-green-50 border-green-200'
      case 'Hold': return 'text-yellow-600 bg-yellow-50 border-yellow-200'
      case 'Sell': return 'text-red-600 bg-red-50 border-red-200'
      case 'Strong Sell': return 'text-red-700 bg-red-100 border-red-300'
      default: return 'text-gray-600 bg-gray-50 border-gray-200'
    }
  }

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'Low': return 'text-green-600 bg-green-50 border-green-200'
      case 'Medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200'
      case 'High': return 'text-red-600 bg-red-50 border-red-200'
      default: return 'text-gray-600 bg-gray-50 border-gray-200'
    }
  }

  const getSentimentColor = (label: string) => {
    switch (label) {
      case 'Very Positive': return 'text-green-700 bg-green-100 border-green-300'
      case 'Positive': return 'text-green-600 bg-green-50 border-green-200'
      case 'Neutral': return 'text-gray-600 bg-gray-50 border-gray-200'
      case 'Negative': return 'text-red-600 bg-red-50 border-red-200'
      case 'Very Negative': return 'text-red-700 bg-red-100 border-red-300'
      default: return 'text-gray-600 bg-gray-50 border-gray-200'
    }
  }

  const priceTargetChange = ((ai.priceTarget - currentPrice) / currentPrice) * 100

  return (
    <div className="space-y-6">
      {/* AI Rating Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-blue-600" />
            AI Analysis Summary
          </CardTitle>
          <CardDescription>
            Comprehensive AI-powered analysis for {data.symbol}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center space-y-3">
              <div className="text-sm font-medium text-muted-foreground">Overall Rating</div>
              <Badge className={`${getRatingColor(ai.overallRating)} text-lg px-4 py-2`}>
                {ai.overallRating}
              </Badge>
              <div className="space-y-1">
                <div className="text-xs text-muted-foreground">Confidence</div>
                <Progress value={ai.confidence} className="h-2" />
                <div className="text-xs text-muted-foreground">{ai.confidence}%</div>
              </div>
            </div>

            <div className="text-center space-y-3">
              <div className="text-sm font-medium text-muted-foreground">Risk Level</div>
              <Badge className={`${getRiskColor(ai.riskLevel)} text-lg px-4 py-2`}>
                <Shield className="h-4 w-4 mr-1" />
                {ai.riskLevel}
              </Badge>
            </div>

            <div className="text-center space-y-3">
              <div className="text-sm font-medium text-muted-foreground">Price Target</div>
              <div className="text-2xl font-bold text-blue-600">
                ${ai.priceTarget.toFixed(2)}
              </div>
              <div className={`text-sm font-medium ${
                priceTargetChange > 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {priceTargetChange > 0 ? '+' : ''}{priceTargetChange.toFixed(1)}%
              </div>
            </div>

            <div className="text-center space-y-3">
              <div className="text-sm font-medium text-muted-foreground">Market Sentiment</div>
              <Badge className={`${getSentimentColor(ai.sentiment.label)} text-sm px-3 py-1`}>
                {ai.sentiment.label}
              </Badge>
              <div className="text-xs text-muted-foreground">
                Score: {ai.sentiment.score}/100
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Detailed Scores */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-purple-600" />
            Analysis Breakdown
          </CardTitle>
          <CardDescription>
            Detailed scoring across different analysis dimensions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-blue-600" />
                  <span className="font-medium">Technical Analysis</span>
                </div>
                <span className="text-sm font-medium">{ai.technicalScore}/100</span>
              </div>
              <Progress value={ai.technicalScore} className="h-3" />
              <div className="text-xs text-muted-foreground">
                Based on price patterns, indicators, and chart analysis
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Zap className="h-4 w-4 text-green-600" />
                  <span className="font-medium">Fundamental Analysis</span>
                </div>
                <span className="text-sm font-medium">{ai.fundamentalScore}/100</span>
              </div>
              <Progress value={ai.fundamentalScore} className="h-3" />
              <div className="text-xs text-muted-foreground">
                Based on financial metrics, earnings, and company fundamentals
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <TrendingDown className="h-4 w-4 text-orange-600" />
                  <span className="font-medium">Market Conditions</span>
                </div>
                <span className="text-sm font-medium">{ai.marketScore}/100</span>
              </div>
              <Progress value={ai.marketScore} className="h-3" />
              <div className="text-xs text-muted-foreground">
                Based on overall market trends, sector performance, and economic factors
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Key Factors */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-amber-600" />
            Key Analysis Factors
          </CardTitle>
          <CardDescription>
            Important factors influencing the AI analysis and rating
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {ai.keyFactors.map((factor, index) => (
              <div key={index} className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg">
                <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0" />
                <p className="text-sm text-slate-700">{factor}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* AI Disclaimer */}
      <Card className="border-amber-200 bg-amber-50">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
            <div className="space-y-1">
              <div className="font-medium text-amber-800">AI Analysis Disclaimer</div>
              <p className="text-sm text-amber-700">
                This analysis is generated by AI and should not be considered as financial advice. 
                Always conduct your own research and consult with financial professionals before making investment decisions. 
                Past performance does not guarantee future results.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}