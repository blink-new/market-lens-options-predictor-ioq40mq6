import { useState } from 'react'
import { Search, TrendingUp, TrendingDown, Activity, DollarSign, BarChart3, Brain } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Input } from './ui/input'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs'
import { StockChart } from './StockChart'
import { TechnicalIndicators } from './TechnicalIndicators'
import { AIAnalysis } from './AIAnalysis'
import { NewsSection } from './NewsSection'
import { useStockData } from '../hooks/useStockData'
import { Skeleton } from './ui/skeleton'

export function StockDashboard() {
  const [ticker, setTicker] = useState('')
  const [searchTicker, setSearchTicker] = useState('')
  const { data: stockData, isLoading, error } = useStockData(searchTicker)

  const handleSearch = () => {
    if (ticker.trim()) {
      setSearchTicker(ticker.toUpperCase())
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch()
    }
  }

  return (
    <div className="min-h-screen p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-blue-600 rounded-xl">
              <Brain className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              StockSense AI
            </h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Advanced AI-powered stock analysis with real-time predictions, technical indicators, and market insights
          </p>
        </div>

        {/* Search Bar */}
        <Card className="max-w-2xl mx-auto">
          <CardContent className="p-6">
            <div className="flex gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Enter stock ticker (e.g., AAPL, TSLA, MSFT)"
                  value={ticker}
                  onChange={(e) => setTicker(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="pl-10 text-lg h-12"
                />
              </div>
              <Button 
                onClick={handleSearch} 
                size="lg"
                className="px-8 bg-blue-600 hover:bg-blue-700"
                disabled={isLoading}
              >
                {isLoading ? 'Analyzing...' : 'Analyze'}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Loading State */}
        {isLoading && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {[...Array(4)].map((_, i) => (
                <Card key={i}>
                  <CardContent className="p-6">
                    <Skeleton className="h-4 w-20 mb-2" />
                    <Skeleton className="h-8 w-24" />
                  </CardContent>
                </Card>
              ))}
            </div>
            <Card>
              <CardContent className="p-6">
                <Skeleton className="h-64 w-full" />
              </CardContent>
            </Card>
          </div>
        )}

        {/* Error State */}
        {error && (
          <Card className="max-w-2xl mx-auto border-red-200">
            <CardContent className="p-6 text-center">
              <div className="text-red-500 mb-2">
                <Activity className="h-8 w-8 mx-auto" />
              </div>
              <h3 className="text-lg font-semibold text-red-700 mb-2">Unable to fetch stock data</h3>
              <p className="text-red-600">
                Please check the ticker symbol and try again. Make sure it's a valid stock symbol.
              </p>
            </CardContent>
          </Card>
        )}

        {/* Stock Data Display */}
        {stockData && !isLoading && (
          <div className="space-y-6 animate-fade-in">
            {/* Stock Header */}
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <h2 className="text-2xl font-bold">{stockData.symbol}</h2>
                    <p className="text-muted-foreground">{stockData.companyName}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="text-3xl font-bold">${stockData.currentPrice.toFixed(2)}</div>
                      <div className={`flex items-center gap-1 ${
                        stockData.change >= 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {stockData.change >= 0 ? (
                          <TrendingUp className="h-4 w-4" />
                        ) : (
                          <TrendingDown className="h-4 w-4" />
                        )}
                        <span className="font-semibold">
                          {stockData.change >= 0 ? '+' : ''}{stockData.change.toFixed(2)} 
                          ({stockData.changePercent >= 0 ? '+' : ''}{stockData.changePercent.toFixed(2)}%)
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 mb-2">
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium text-muted-foreground">Market Cap</span>
                  </div>
                  <div className="text-2xl font-bold">${(stockData.marketCap / 1e9).toFixed(1)}B</div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 mb-2">
                    <BarChart3 className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium text-muted-foreground">Volume</span>
                  </div>
                  <div className="text-2xl font-bold">{(stockData.volume / 1e6).toFixed(1)}M</div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium text-muted-foreground">52W High</span>
                  </div>
                  <div className="text-2xl font-bold">${stockData.high52Week.toFixed(2)}</div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingDown className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium text-muted-foreground">52W Low</span>
                  </div>
                  <div className="text-2xl font-bold">${stockData.low52Week.toFixed(2)}</div>
                </CardContent>
              </Card>
            </div>

            {/* Main Content Tabs */}
            <Tabs defaultValue="chart" className="space-y-6">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="chart">Price Chart</TabsTrigger>
                <TabsTrigger value="technical">Technical</TabsTrigger>
                <TabsTrigger value="ai">AI Analysis</TabsTrigger>
                <TabsTrigger value="news">News</TabsTrigger>
              </TabsList>

              <TabsContent value="chart" className="space-y-4">
                <StockChart data={stockData} />
              </TabsContent>

              <TabsContent value="technical" className="space-y-4">
                <TechnicalIndicators data={stockData} />
              </TabsContent>

              <TabsContent value="ai" className="space-y-4">
                <AIAnalysis data={stockData} />
              </TabsContent>

              <TabsContent value="news" className="space-y-4">
                <NewsSection ticker={searchTicker} />
              </TabsContent>
            </Tabs>
          </div>
        )}

        {/* Welcome State */}
        {!searchTicker && !isLoading && (
          <div className="text-center py-16">
            <div className="max-w-md mx-auto space-y-6">
              <div className="p-4 bg-blue-100 rounded-full w-20 h-20 mx-auto flex items-center justify-center">
                <BarChart3 className="h-10 w-10 text-blue-600" />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Ready to analyze stocks</h3>
                <p className="text-muted-foreground">
                  Enter a stock ticker symbol above to get started with AI-powered analysis
                </p>
              </div>
              <div className="flex flex-wrap gap-2 justify-center">
                {['AAPL', 'TSLA', 'MSFT', 'GOOGL', 'AMZN', 'NVDA'].map((symbol) => (
                  <Badge
                    key={symbol}
                    variant="secondary"
                    className="cursor-pointer hover:bg-blue-100 transition-colors"
                    onClick={() => {
                      setTicker(symbol)
                      setSearchTicker(symbol)
                    }}
                  >
                    {symbol}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}