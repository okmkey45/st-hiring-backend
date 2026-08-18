import { EventDAL } from "../../dal/events.dal";
import { Request, Response } from "express";
import { buildPaginatedResponse } from "../../middleware/pagination";

export const createGetEventsController = ({
  eventsDAL,
}: {
  eventsDAL: EventDAL;
}) => async (req: Request, res: Response) => {
  const { limit, skip, fields } = res.locals.pagination;
  
  const [events, totalItems] = await Promise.all([
    eventsDAL.getEvents({ limit, skip, fields }),
    eventsDAL.countEvents(),
  ]);

  const response = buildPaginatedResponse(events, totalItems, limit, skip);
  
  res.json(response);
};
