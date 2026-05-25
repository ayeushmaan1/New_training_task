import { Router } from 'express';
import { submitContact } from '../controllers/contact.controller.js';
import { validate } from '../middleware/validate.js';
import { contactSchema } from '../validators/schemas.js';

const router = Router();

router.post('/', validate(contactSchema), submitContact);

export default router;
