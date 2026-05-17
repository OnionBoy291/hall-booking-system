# JS Cleanup Plan (hall-booking-system)

- [ ] Inspect all JS files for repeated helper functions and unused code.
- [ ] Consolidate duplicated helpers into a shared script (location formatting, payment formatting, currency formatting).
- [ ] Remove unused functions found in previous inspection (e.g., homepage.js filterByLocation if not referenced).
- [ ] Add safety null-checks for optional DOM elements (e.g., shareBtn in booking.js).
- [ ] Ensure HTML pages include the new shared script before page scripts.
- [ ] Verify pages: homepage, booking, confirm_reservation, history.
- [ ] Run a quick search for remaining duplicates/unused patterns after edits.

