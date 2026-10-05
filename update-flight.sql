-- ============================================================
-- Update a flight's ticket price and baggage
-- Usage: in Supabase SQL Editor, first run the SELECT to find
-- your row, then run the UPDATE with the correct ticket number.
-- ============================================================

-- 1) Find the flight row(s)
SELECT
  id,
  ticket_number,
  passenger_name,
  flight_number,
  flight_date,
  baggage,
  total_price
FROM public.flights;

-- 2) Update by ticket number (adjust the WHERE clause if needed)
UPDATE public.flights
SET
  total_price = '1209.00',
  baggage = '4 luggage box'
WHERE ticket_number = 'AA173-001';

-- Alternative: update by id if you prefer exact-row targeting
-- UPDATE public.flights
-- SET total_price = '1209.00', baggage = '4 luggage box'
-- WHERE id = '<paste-the-id-from-step-1>';

-- 3) Verify the change
SELECT id, ticket_number, passenger_name, baggage, total_price
FROM public.flights
WHERE ticket_number = 'AA173-001';
