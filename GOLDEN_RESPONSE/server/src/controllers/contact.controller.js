import { asyncHandler } from '../utils/asyncHandler.js';
import { sendContactEmail } from '../utils/mailer.js';
import { saveContact } from '../data/store.js';

export const submitContact = asyncHandler(async (req, res) => {
  const contact = await saveContact(req.body);
  await sendContactEmail(req.body);

  res.status(201).json({
    success: true,
    message: 'Message sent successfully',
    data: {
      contact
    }
  });
});
