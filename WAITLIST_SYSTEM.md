# Waitlist System Documentation

## How the Waitlist System Works

### Database Structure
The `waitlist` table in Supabase stores all user information:

- **id**: Unique identifier (UUID)
- **name**: User's full name
- **email**: User's email address
- **phone**: User's phone number (used for identification)
- **payment_intent_id**: Stripe payment intent ID (null until payment)
- **has_ticket**: Boolean - true if user has purchased a ticket
- **ticket_purchased_at**: Timestamp when ticket was purchased
- **created_at**: Timestamp when user was first added to waitlist

### User Flow

1. **User Enters Form** (SignupForm)
   - User enters: Name, Email, Phone
   - System checks if phone number exists in database
   - If phone exists AND has tickets → Shows ticket list
   - If phone exists but no tickets → Proceeds to payment
   - If new phone → Proceeds to payment

2. **User Submits Form**
   - User is saved to waitlist with `has_ticket: false`
   - This happens BEFORE payment

3. **Payment Screen**
   - User completes payment via Stripe
   - On success, user is updated with:
     - `has_ticket: true`
     - `ticket_purchased_at: current timestamp`
     - `payment_intent_id: Stripe payment ID`

4. **Ticket Success Screen**
   - Shows QR code
   - Fetches all tickets for user's phone number
   - Displays ticket list
   - Shows App Store / Play Store buttons

### "Remember Me" Feature

The system uses **localStorage** to remember users:

- **anchor_formData**: Stores name, email, phone
- **anchor_step**: Stores current step in flow
- **anchor_paymentIntentId**: Stores payment intent ID

When user returns:
- Form data is automatically filled
- System checks for existing tickets
- If tickets found, shows ticket list immediately

### Phone Number Matching

Phone numbers are **normalized** before comparison:
- Removes: spaces, dashes, parentheses, plus signs
- Example: `+1 (555) 123-4567` → `15551234567`
- This ensures matching works regardless of format

### API Endpoints

1. **POST /api/save-user-to-wishlist**
   - Saves user to waitlist (before payment)
   - Sets `has_ticket: false`

2. **POST /api/check-existing-user**
   - Checks if user exists by phone number
   - Returns user data and tickets if found

3. **POST /api/save-user**
   - Updates user after payment
   - Sets `has_ticket: true`
   - Records payment intent ID

4. **POST /api/get-user-tickets**
   - Fetches all tickets for a phone number
   - Returns only tickets where `has_ticket: true`

### Troubleshooting

**Issue: Not detecting existing user**
- Check phone number format matches
- Check browser console for API errors
- Verify phone number is saved correctly in database

**Issue: Tickets not showing**
- Verify `has_ticket` is `true` in database
- Check `ticket_purchased_at` is set
- Verify phone number normalization is working

**Issue: Data not persisting**
- Check localStorage is enabled
- Verify data is being saved on form submit
- Check browser console for errors

