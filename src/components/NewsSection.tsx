import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Badge } from './ui/badge'
import { Button } from './ui/button'
import { ExternalLink, Clock, TrendingUp, TrendingDown, Newspaper } from 'lucide-react'
import { useNewsData } from '../hooks/useNewsData'
import { Skeleton } from './ui/skeleton'

interface NewsSectionProps {
  ticker: string
}

export function NewsSection({ ticker }: NewsSectionProps) {
  const { data: newsData, isLoading } = useNewsData(ticker)

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment.toLowerCase()) {
      case 'positive': return 'text-green-600 bg-green-50 border-green-200'
      case 'negative': return 'text-red-600 bg-red-50 border-red-200'
      default: return 'text-gray-600 bg-gray-50 border-gray-200'
    }
  }

  const getSentimentIcon = (sentiment: string) => {
    switch (sentiment.toLowerCase()) {
      case 'positive': return <TrendingUp className="h-3 w-3" />
      case 'negative': return <TrendingDown className="h-3 w-3" />
      default: return <Newspaper className="h-3 w-3" />
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <div className="space-y-3">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-full" />
                <Skeleton className="h-3 w-2/3" />
                <div className="flex gap-2">
                  <Skeleton className="h-6 w-16" />
                  <Skeleton className="h-6 w-20" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (!newsData || newsData.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <Newspaper className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No news available</h3>
          <p className="text-muted-foreground">
            Unable to fetch news for {ticker} at the moment. Please try again later.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* News Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Newspaper className="h-5 w-5 text-blue-600" />
            Latest News & Sentiment
          </CardTitle>
          <CardDescription>
            Recent news articles and market sentiment for {ticker}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center space-y-2">
              <div className="text-sm font-medium text-muted-foreground">Total Articles</div>
              <div className="text-2xl font-bold text-blue-600">{newsData.length}</div>
            </div>
            <div className="text-center space-y-2">
              <div className="text-sm font-medium text-muted-foreground">Positive Sentiment</div>
              <div className="text-2xl font-bold text-green-600">
                {newsData.filter(n => n.sentiment === 'positive').length}
              </div>
            </div>
            <div className="text-center space-y-2">
              <div className="text-sm font-medium text-muted-foreground">Negative Sentiment</div>
              <div className="text-2xl font-bold text-red-600">
                {newsData.filter(n => n.sentiment === 'negative').length}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* News Articles */}
      <div className="space-y-4">
        {newsData.map((article, index) => (
          <Card key={index} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold leading-tight hover:text-blue-600 transition-colors">
                    {article.title}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {article.summary}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <Badge className={getSentimentColor(article.sentiment)}>
                    {getSentimentIcon(article.sentiment)}
                    <span className="ml-1 capitalize">{article.sentiment}</span>
                  </Badge>
                  
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    <span>{article.publishedAt}</span>
                  </div>
                  
                  <Badge variant="outline" className="text-xs">
                    {article.source}
                  </Badge>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <div className="text-xs text-muted-foreground">
                    Impact Score: <span className="font-medium">{article.impactScore}/10</span>
                  </div>
                  
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => window.open(article.url, '_blank')}
                    className="text-xs"
                  >
                    Read Full Article
                    <ExternalLink className="h-3 w-3 ml-1" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* News Disclaimer */}
      <Card className="border-blue-200 bg-blue-50">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <Newspaper className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div className="space-y-1">
              <div className="font-medium text-blue-800">News & Sentiment Analysis</div>
              <p className="text-sm text-blue-700">
                News sentiment is analyzed using AI and may not reflect actual market impact. 
                Always verify information from multiple sources and consider the credibility of news outlets.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}