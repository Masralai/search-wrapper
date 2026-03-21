import { getJson } from 'serpapi';
import dotenv from 'dotenv';

dotenv.config();

export interface SearchResult {
  title: string;
  link: string;
  snippet?: string;
  source?: string;
  displayed_link?: string;
  thumbnail?: string;
}

export interface SearchResponse {
  organic_results: SearchResult[];
  search_information?: any;
  search_parameters?: any;
}

class SearchService {
  private static apiKey = process.env.SERP_API_KEY;

  public static async search(query: string, start: number = 0, num: number = 10): Promise<SearchResponse> {
    if (!this.apiKey) {
      throw new Error('SERP_API_KEY is not defined in environment variables.');
    }

    const params = {
      engine: 'google',
      q: query,
      api_key: this.apiKey,
      num,
      start,
    };

    return new Promise((resolve, reject) => {
      getJson(params, (json: any) => {
        if (json.error) {
          reject(new Error(json.error));
        } else {
          resolve({
            organic_results: json.organic_results || [],
            search_information: json.search_information,
            search_parameters: json.search_parameters,
          });
        }
      });
    });
  }
}

export default SearchService;
