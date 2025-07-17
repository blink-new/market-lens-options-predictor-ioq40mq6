import { useQuery } from '@tanstack/react-query'

interface NewsArticle {
  title: string
  summary: string
  url: string
  source: string
  publishedAt: string
  sentiment: 'positive' | 'negative' | 'neutral'
  impactScore: number
}

// Mock news data generator
const generateMockNewsData = (symbol: string): NewsArticle[] => {
  const newsTemplates = [
    {
      title: `${symbol} Reports Strong Q4 Earnings, Beats Analyst Expectations`,
      summary: `${symbol} delivered impressive quarterly results with revenue growth exceeding forecasts. The company's strong performance was driven by increased demand and operational efficiency improvements.`,
      sentiment: 'positive' as const,
      impactScore: 8
    },
    {
      title: `Analysts Upgrade ${symbol} Price Target Following Strategic Partnership`,
      summary: `Major investment firms have raised their price targets for ${symbol} following the announcement of a strategic partnership that is expected to drive long-term growth.`,
      sentiment: 'positive' as const,
      impactScore: 7
    },
    {
      title: `${symbol} Faces Regulatory Scrutiny Over Market Practices`,
      summary: `Regulatory authorities are investigating ${symbol}'s business practices, which could potentially impact the company's operations and market position in the coming quarters.`,
      sentiment: 'negative' as const,
      impactScore: 6
    },
    {
      title: `${symbol} Announces Major Investment in AI Technology`,
      summary: `The company revealed plans to invest heavily in artificial intelligence capabilities, positioning itself for future growth in the rapidly evolving tech landscape.`,
      sentiment: 'positive' as const,
      impactScore: 9
    },
    {
      title: `Market Volatility Impacts ${symbol} Trading Volume`,
      summary: `Recent market turbulence has led to increased trading activity in ${symbol} shares, with investors closely monitoring the company's response to changing market conditions.`,
      sentiment: 'neutral' as const,
      impactScore: 5
    },
    {
      title: `${symbol} CEO Discusses Future Growth Strategy in Investor Call`,
      summary: `During the latest earnings call, the CEO outlined ambitious plans for expansion and innovation, providing insights into the company's strategic direction for the next fiscal year.`,
      sentiment: 'positive' as const,
      impactScore: 6
    },
    {
      title: `Supply Chain Challenges May Impact ${symbol} Production`,
      summary: `Industry-wide supply chain disruptions could affect ${symbol}'s manufacturing capabilities and delivery timelines, potentially impacting near-term financial performance.`,
      sentiment: 'negative' as const,
      impactScore: 7
    },
    {
      title: `${symbol} Launches New Product Line to Capture Market Share`,
      summary: `The company unveiled an innovative product lineup designed to compete in emerging markets, demonstrating its commitment to diversification and growth.`,
      sentiment: 'positive' as const,
      impactScore: 8
    }
  ]

  const sources = ['Reuters', 'Bloomberg', 'CNBC', 'MarketWatch', 'Yahoo Finance', 'Financial Times', 'Wall Street Journal']
  
  // Generate 5-8 random articles
  const numArticles = Math.floor(Math.random() * 4) + 5
  const selectedTemplates = newsTemplates.sort(() => 0.5 - Math.random()).slice(0, numArticles)
  
  return selectedTemplates.map((template, index) => {
    const daysAgo = Math.floor(Math.random() * 7)
    const hoursAgo = Math.floor(Math.random() * 24)
    const publishedDate = new Date()
    publishedDate.setDate(publishedDate.getDate() - daysAgo)
    publishedDate.setHours(publishedDate.getHours() - hoursAgo)
    
    return {
      ...template,
      url: `https://example.com/news/${symbol.toLowerCase()}-${index + 1}`,
      source: sources[Math.floor(Math.random() * sources.length)],
      publishedAt: formatTimeAgo(publishedDate)
    }
  })
}

const formatTimeAgo = (date: Date): string => {
  const now = new Date()
  const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))
  
  if (diffInHours < 1) {
    return 'Just now'
  } else if (diffInHours < 24) {
    return `${diffInHours}h ago`
  } else {
    const diffInDays = Math.floor(diffInHours / 24)
    return `${diffInDays}d ago`
  }
}

const fetchNewsData = async (symbol: string): Promise<NewsArticle[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 700))
  
  // Simulate occasional errors
  if (Math.random() < 0.05) {
    throw new Error('Failed to fetch news data')
  }
  
  return generateMockNewsData(symbol)
}

export const useNewsData = (symbol: string) => {
  return useQuery({
    queryKey: ['news', symbol],
    queryFn: () => fetchNewsData(symbol),
    enabled: !!symbol,
    staleTime: 10 * 60 * 1000, // 10 minutes
    retry: 1
  })
}