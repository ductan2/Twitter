import express from 'express';
import { validationResult, ValidationChain } from 'express-validator';
import { RunnableValidationChains } from "express-validator/src/middlewares/schema"


// sequential processing, stops running validations chain if the previous one fails.
export const validate = (validation: RunnableValidationChains<ValidationChain>) => {
  return async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    await validation.run(req);
    const errorValidation = validationResult(req);

    if (errorValidation.isEmpty()) {
      return next();
    }
    const arrayError: any = errorValidation.mapped();
    const simplifiedErrors = [];
    for (const key in arrayError) {
      simplifiedErrors.push({
        message: arrayError[key].msg,
        path: arrayError[key].path,
        status:400
      });
    }
    res.status(400).json(simplifiedErrors);
  };
};
