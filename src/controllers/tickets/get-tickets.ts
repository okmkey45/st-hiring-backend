import { NextFunction, Request, Response } from "express";
import { TicketsDAL } from "../../dal/tickets.dal";
import { GetTicketsPayload } from "./get-tickets.schema";

export const createGetTicketsController = ({
  ticketsDAL,
}: {
  ticketsDAL: TicketsDAL;
}) => async (
  req: Request,
  res: Response<any, { validated: GetTicketsPayload }>,
  next: NextFunction,
) => {
  try {
    const { eventId } = res.locals.validated.params;
    const tickets = await ticketsDAL.getTicketsByEvent(eventId);
    res.status(200).json({
      tickets,
    });
  } catch (err) {
    next(err);
  }
};
