'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Search, History, Trash2, Clock, Globe, ArrowRight, Loader2 } from 'lucide-react';
import { searchAPI, SearchResult } from '@/lib/api';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const [activeQuery, setActiveQuery] = useState('');
  const queryClient = useQueryClient();

  // Search Mutation
  const searchMutation = useMutation({
    mutationFn: (q: string) => searchAPI.performSearch(q),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['history'] });
    },
  });

  // History Query
  const { data: historyData, isLoading: historyLoading } = useQuery({
    queryKey: ['history'],
    queryFn: () => searchAPI.getSearchHistory(),
  });

  // Clear History Mutation
  const clearHistoryMutation = useMutation({
    mutationFn: () => searchAPI.clearAllHistory(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['history'] });
    },
  });

  const handleSearch = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (query.trim()) {
      setActiveQuery(query);
      searchMutation.mutate(query);
    }
  };

  const handleHistoryClick = (q: string) => {
    setQuery(q);
    setActiveQuery(q);
    searchMutation.mutate(q);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Header / Search Bar */}
      <header className="bg-white border-b sticky top-0 z-10 p-4 shadow-sm">
        <div className="max-w-5xl mx-auto flex gap-4 items-center">
          <div className="flex items-center gap-2 font-bold text-xl text-primary hidden sm:flex">
            <Globe className="w-6 h-6" />
            <span>SearchWrapper</span>
          </div>
          <form onSubmit={handleSearch} className="flex-1 flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search anything..."
                className="pl-10 h-11 bg-slate-50 border-slate-200 focus-visible:ring-primary"
              />
            </div>
            <Button type="submit" disabled={searchMutation.isPending} className="h-11 px-6">
              {searchMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Search'}
            </Button>
          </form>
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto w-full p-4 grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Left Sidebar: History */}
        <aside className="md:col-span-1 space-y-4 order-2 md:order-1">
          <Card className="h-[calc(100vh-120px)] sticky top-24 border-none shadow-md">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-semibold flex items-center gap-2">
                  <History className="w-4 h-4" />
                  Recent Searches
                </CardTitle>
                {historyData?.data?.searches?.length ? (
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8 text-slate-400 hover:text-red-500"
                    onClick={() => clearHistoryMutation.mutate()}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                ) : null}
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <ScrollArea className="h-[calc(100vh-200px)]">
                <div className="px-4 py-2 space-y-1">
                  {historyLoading ? (
                    Array(5).fill(0).map((_, i) => (
                      <Skeleton key={i} className="h-10 w-full rounded-md mb-2" />
                    ))
                  ) : historyData?.data?.searches?.map((item) => (
                    <button
                      key={item._id}
                      onClick={() => handleHistoryClick(item.query)}
                      className="w-full text-left p-3 rounded-lg hover:bg-slate-100 transition-colors group flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3 overflow-hidden">
                        <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="text-sm truncate text-slate-700">{item.query}</span>
                      </div>
                      <ArrowRight className="w-3.5 h-3.5 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </button>
                  ))}
                  {!historyLoading && !historyData?.data?.searches?.length && (
                    <div className="text-center py-8 text-slate-400 text-sm">
                      No search history yet
                    </div>
                  )}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </aside>

        {/* Center: Search Results */}
        <section className="md:col-span-3 space-y-6 order-1 md:order-2">
          {searchMutation.isPending ? (
            <div className="space-y-6">
              {Array(3).fill(0).map((_, i) => (
                <Card key={i} className="border-none shadow-sm overflow-hidden">
                  <CardHeader className="pb-2">
                    <Skeleton className="h-6 w-3/4 mb-2" />
                    <Skeleton className="h-4 w-1/4" />
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-4 w-full mb-2" />
                    <Skeleton className="h-4 w-5/6" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : searchMutation.isSuccess && searchMutation.data ? (
            <div className="space-y-6">
              <div className="flex items-center justify-between text-sm text-slate-500 px-1">
                <p>
                  Found {searchMutation.data.data.results.length} results for 
                  <span className="font-semibold text-slate-900 ml-1">"{activeQuery}"</span>
                </p>
                <Badge variant="secondary" className="font-normal">
                  {searchMutation.data.data.searchInformation?.total_results || '0'} total matches
                </Badge>
              </div>

              {searchMutation.data.data.results.map((result, idx) => (
                <Card key={idx} className="border-none shadow-sm hover:shadow-md transition-shadow group">
                  <CardHeader className="pb-2">
                    <div className="text-xs text-green-700 mb-1 truncate">{result.displayLink}</div>
                    <CardTitle className="text-xl">
                      <a 
                        href={result.link} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline decoration-2"
                      >
                        {result.title}
                      </a>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-slate-600 leading-relaxed text-sm">
                      {result.snippet}
                    </p>
                  </CardContent>
                </Card>
              ))}

              {searchMutation.data.data.results.length === 0 && (
                <div className="text-center py-20 bg-white rounded-xl shadow-sm border border-dashed">
                  <Search className="w-12 h-12 text-slate-200 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-slate-900">No results found</h3>
                  <p className="text-slate-500">Try adjusting your keywords or check your spelling.</p>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-20 bg-white rounded-xl shadow-sm flex flex-col items-center justify-center">
              <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6">
                <Search className="w-10 h-10 text-primary" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900 mb-2">Welcome to SearchWrapper</h2>
              <p className="text-slate-500 max-w-md">
                Enter a search query above to browse the web with our optimized interface. 
                Your history will be saved automatically for quick access later.
              </p>
            </div>
          )}
        </section>
      </main>

      <footer className="p-6 text-center text-slate-400 text-sm border-t bg-white mt-auto">
        &copy; {new Date().getFullYear()} SearchWrapper Professional. Built with Next.js and Shadcn UI.
      </footer>
    </div>
  );
}
