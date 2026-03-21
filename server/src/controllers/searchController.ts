import { Request, Response, NextFunction } from 'express';
import SearchService from '../services/googleSearch';
import Search from '../models/Search';

interface SearchRequestBody {
  query: string;
  page?: number;
}

export const performSearch = async (
  req: Request<{}, {}, SearchRequestBody>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { query, page = 1 } = req.body;

    if (!query) {
      res.status(400).json({
        success: false,
        error: 'Search query is required',
      });
      return;
    }

    console.log(`Received query from frontend: "${query}", page: ${page}`);

    const startTime = Date.now();

    // Calculate start parameter for pagination (Google uses 0-based indexing)
    const start = (page - 1) * 10;

    const searchResults = await SearchService.search(query, start, 10);
    const endTime = Date.now();
    const searchTime = endTime - startTime;

    console.log(`Search completed in ${searchTime}ms`);

    // Only save the first page to history to avoid duplicates
    if (page === 1) {
      try {
        await Search.create({
          query,
          results: searchResults.organic_results.map(r => ({
            title: r.title,
            link: r.link,
            snippet: r.snippet || '',
            displayLink: r.displayed_link || '',
          })),
          resultCount: searchResults.organic_results.length,
          searchTime,
        });
      } catch (dbError) {
        console.error('Failed to save search to history:', dbError);
        // We don't want to fail the search if history saving fails
      }
    }

    res.status(200).json({
      success: true,
      data: {
        results: searchResults.organic_results,
        searchInformation: searchResults.search_information,
        searchParameters: searchResults.search_parameters,
        query,
        page,
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error) {
    next(error);
  }
};
