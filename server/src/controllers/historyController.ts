import { Request, Response, NextFunction } from 'express';
import Search from '../models/Search';

export const getSearchHistory = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;

    const searches = await Search.find()
      .sort({ timestamp: -1 })
      .limit(limit)
      .skip((page - 1) * limit)
      .select('query timestamp resultCount searchTime');

    const total = await Search.countDocuments();

    res.status(200).json({
      success: true,
      data: {
        searches,
        totalPages: Math.ceil(total / limit),
        currentPage: page,
        total,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const deleteSearchHistory = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;

    if (!id) {
      res.status(400).json({ success: false, error: 'ID is required' });
      return;
    }

    const deleted = await Search.findByIdAndDelete(id);

    if (!deleted) {
      res.status(404).json({ success: false, error: 'Search record not found' });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Search history deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

export const clearAllHistory = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    await Search.deleteMany({});

    res.status(200).json({
      success: true,
      message: 'All search history cleared successfully',
    });
  } catch (error) {
    next(error);
  }
};
