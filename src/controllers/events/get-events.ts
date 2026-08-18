import { EventDAL } from "../../dal/events.dal";
import { Request, Response } from "express";

export const createGetEventsController = ({
  eventsDAL,
}: {
  eventsDAL: EventDAL;
}) => async (req: Request, res: Response) => {
  const { limit, skip, fields } = res.locals.pagination;
  const events = await eventsDAL.getEvents({ limit, skip, fields });
  res.json(events);
};
